const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');
const axios = require("../../function/axios");
var mssqlR = require('../../function/mssqlR');

const SAP_BASE_URL = 'http://172.23.10.168:14094/03iPPGETDATACHEM';



router.post('/getallgraph', async (req, res) => {

  //-------------------------------------
  console.log(req.body);
  let input = req.body;
  //-------------------------------------

  let output = { "re": "NOK" }

  try {
    let MATCP = `${input['MATCP']}`;
    let plant = input['plant'];

    let historydata = await mongodb.findsort(`${plant}dbMAIN`, 'MAIN', { "MATNO": MATCP }, 1);
    output = {
      "status": "ok",
      "outdata": historydata.length > 0 ? historydata : [],
    };

  } catch (err) {
    console.error(err);
    output = { "re": "NOK" };
  }
  res.json(output);
});


router.post('/botsemi_soi8', async (req, res) => {

  //-------------------------------------
  console.log(req.body);
  let input = req.body;
  //-------------------------------------

  let output = { "return": "NOK" }

  try {

    let response = await axios.post(
      `${SAP_BASE_URL}/GETDATA`,
      {
        HEADER: {
          PLANT: "1000",
          ORD_ST_DATE_FR: `${input["day"]}.${input['month']}.${input['year']}`,
          ORD_ST_DATE_TO: `${input['day_next']}.${input['month_next']}.${input['year_next']}`,
          ORDER_TYPE: "",
          PROD_SUP: ""
        },
        PROC_ORD: [
          { PROCESS_ORDER: "", MATERIAL: "" }
        ]
      }
    )

    let orderset = [];
    let ordersetwitdata = [];
    if (response['HEADER_INFO'] != undefined) {
      for (let index = 0; index < response['HEADER_INFO'].length; index++) {
        const item = response['HEADER_INFO'][index];

        orderset.push(`${item['MATERIAL']}${item['PROCESS_ORDER']}`);

        if (`${item['SYSTEM_STATUS']}`.includes("DLV") === false && `${item['MATERIAL']}`.substring(0, 2) === "12") {
          ordersetwitdata.push(
            {
              "TIMECONF": {
                "ORDERID": `${item['PROCESS_ORDER']}`,
                "PHASE": "0020",
                "YIELD": '',
                "CONF_QUAN_UNIT": `${item['UOM']}`,
                "POSTG_DATE": `${input['day_next']}.${input['month_next']}.${input['year_next']}`,
                "EXEC_START_DATE": `${input['day_next']}.${input['month_next']}.${input['year_next']}`,
              },
              "T_GOODSMOVEMENT": [
                {
                  "MATERIAL": `${item['MATERIAL']}`,
                  "PLANT": "1000",
                  "STGE_LOC": `${item['STGE_LOC']}`,
                  "BATCH": `${item['BATCH']}`,
                  "MOVE_TYPE": "101",
                  "ENTRY_QNT": "",
                  "ENTRY_UOM": `${item['UOM']}`,
                  "MFG_DATE": `${input['day_next']}.${input['month_next']}.${input['year_next']}`,
                }
              ],
            }
          );
        }

      }
    }

    // Build datafinalset from DB — skip query when orderset is empty (avoids invalid IN ())
    let datafinalset = [];
    if (orderset.length > 0) {
      const paramObj = {};
      orderset.forEach((val, i) => { paramObj[`ord${i}`] = val; });
      const paramPlaceholders = orderset.map((_, i) => `@ord${i}`).join(',');
      const stringsetup =
        `SELECT * FROM [SOI8LOG].[dbo].[confirmweightrecore] WHERE [order] IN (${paramPlaceholders}) ORDER BY date DESC`;

      let dbsap = await mssqlR.qureyRP(stringsetup, paramObj);

      if (dbsap['recordsets'] != undefined) {
        let setpg = dbsap['recordsets'][0];
        for (let p = 0; p < setpg.length; p++) {
          if (setpg[p]['seq'] === '2') {
            datafinalset.push({
              "ORDER": setpg[p]['order'],
              "seq": setpg[p]['seq'],
              "weight": setpg[p]['weight'],
            });
          }
        }
      }
    }

    // Use Map for O(n+m) lookup instead of O(n×m) nested loop
    const weightMap = new Map();
    for (const item of datafinalset) {
      weightMap.set(item['ORDER'], item['weight']);
    }
    for (let u = 0; u < ordersetwitdata.length; u++) {
      const key = `${ordersetwitdata[u]['T_GOODSMOVEMENT'][0]['MATERIAL']}${ordersetwitdata[u]['TIMECONF']['ORDERID']}`;
      const weight = weightMap.get(key);
      if (weight !== undefined) {
        ordersetwitdata[u]['TIMECONF']['YIELD'] = weight;
        ordersetwitdata[u]['T_GOODSMOVEMENT'][0]['ENTRY_QNT'] = weight;
      }
    }

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let apf = 0; apf < ordersetwitdata.length; apf++) {
      if (ordersetwitdata[apf]['TIMECONF']['YIELD'] != '') {
        console.log(ordersetwitdata[apf]);

        let saprp = await axios.post(
          `${SAP_BASE_URL}/SETI005DATA`,
          ordersetwitdata[apf]
        );

        const sendText = JSON.stringify(ordersetwitdata[apf]).replaceAll('"', '').replaceAll(',', ' ');
        const returnText = JSON.stringify(saprp).replaceAll('"', '').replaceAll(',', ' ');
        console.log(sendText);
        await mssqlR.qureyRP(
          `INSERT INTO [SOI8LOG].[dbo].[autosmlog] ([sendtext], [returntext]) VALUES (@sendtext, @returntext)`,
          { sendtext: sendText, returntext: returnText }
        );
        console.log(saprp);
        await delay(2000);
      }
    }

    output = ordersetwitdata;

  } catch (err) {
    console.error(err);
    output = { "return": "NOK" };
  }
  return res.json(output);
});


module.exports = router;
