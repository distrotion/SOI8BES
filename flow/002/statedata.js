const e = require("express");
const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');
var request = require('request');
const axios = require("../../function/axios");
var mssqlR = require('../../function/mssqlR');




router.post('/getallgraph', async (req, res) => {

  //-------------------------------------
  console.log(req.body);
  let input = req.body;
  //-------------------------------------

  let output = { "re": "NOK" }

  try {
    let outdata = [];
    let MATCP = `${input['MATCP']}`;
    let plant = input['plant'];


    let historydata = await mongodb.findsort(`${plant}dbMAIN`, 'MAIN', { $and: [{ "MATNO": MATCP }] }, 1);
    if (historydata.length > 0) {
      output = {
        "status": "ok",
        "outdata": historydata,
      };
    } else {
      output = {
        "status": "ok",
        "outdata": [],
      };
    }



  }
  catch (err) {
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
      `http://172.23.10.168:14094/03iPPGETDATACHEM/GETDATA`,
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

    // console.log(response);
    //MATERIAL
    let orderset = [];
    let ordersetwitdata = [];
    if (response['HEADER_INFO'] != undefined) {
      for (let index = 0; index < response['HEADER_INFO'].length; index++) {

        // console.log(`${response['HEADER_INFO'][index]['MATERIAL']}${response['HEADER_INFO'][index]['PROCESS_ORDER']}`);
        orderset.push(`'${response['HEADER_INFO'][index]['MATERIAL']}${response['HEADER_INFO'][index]['PROCESS_ORDER']}'`);
        if(`${response['HEADER_INFO'][index]['SYSTEM_STATUS']}`.includes("DLV") === false && `${response['HEADER_INFO'][index]['MATERIAL']}`.substring(0,2) === "12"){
        ordersetwitdata.push(
          {
            "TIMECONF": {
              "ORDERID": `${response['HEADER_INFO'][index]['PROCESS_ORDER']}`,
              "PHASE": "0020",
              "YIELD": '',
              "CONF_QUAN_UNIT": `${response['HEADER_INFO'][index]['UOM']}`,
              "POSTG_DATE":
                `${input['day_next']}.${input['month_next']}.${input['year_next']}`,
              "EXEC_START_DATE":
                `${input['day_next']}.${input['month_next']}.${input['year_next']}`,
            },
            "T_GOODSMOVEMENT": [
              {
                "MATERIAL": `${response['HEADER_INFO'][index]['MATERIAL']}`,
                "PLANT": "1000",
                "STGE_LOC": `${response['HEADER_INFO'][index]['STGE_LOC']}`,
                "BATCH": `${response['HEADER_INFO'][index]['BATCH']}`,
                "MOVE_TYPE": "101",
                "ENTRY_QNT": "",
                "ENTRY_UOM": `${response['HEADER_INFO'][index]['UOM']}`,
                "MFG_DATE":`${input['day_next']}.${input['month_next']}.${input['year_next']}`,
                  //  "MFG_DATE":``,
              }
            ],
          }
        );
        // {
        //   TIMECONF: {ORDERID: 1010012160, PHASE: 0020, YIELD: 300, CONF_QUAN_UNIT: KG, POSTG_DATE: 04.03.2026, EXEC_START_DATE: 04.03.2026}, 
        //   T_GOODSMOVEMENT: [{MATERIAL: 12000504, PLANT: 1000, STGE_LOC: C401, BATCH: 2603048, MOVE_TYPE: 101, ENTRY_QNT: 300, ENTRY_UOM: KG, MFG_DATE: 04.03.2026}]
        // }
        }

      }
    }

    let strout = '';
    for (let ki = 0; ki < orderset.length; ki++) {
      if (ki == 0) {
        strout = strout +
          `${orderset[ki]}`
      } else {
        strout = strout +
          `,${orderset[ki]}`
      }
    }


    let stringsetup =
      `SELECT * FROM [SOI8LOG].[dbo].[confirmweightrecore] where [order] in (${strout}) order by date desc`;
    // console.log(stringsetup);
    //recordsets

    let dbsap = await mssqlR.qureyR(stringsetup);


    let datafinalset = [];

    if (dbsap['recordsets'] != undefined) {

      let setpg = dbsap['recordsets'][0]


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

    for (let u = 0; u < ordersetwitdata.length; u++) {

      for (let g = 0; g < datafinalset.length; g++) {
        // console.log(`${ordersetwitdata[u]['T_GOODSMOVEMENT'][0]['MATERIAL']}${ordersetwitdata[u]['TIMECONF']['ORDERID']}`);
        // console.log(datafinalset[g]['ORDER'] === `${ordersetwitdata[u]['T_GOODSMOVEMENT'][0]['MATERIAL']}${ordersetwitdata[u]['TIMECONF']['ORDERID']}`);
        if (datafinalset[g]['ORDER'] === `${ordersetwitdata[u]['T_GOODSMOVEMENT'][0]['MATERIAL']}${ordersetwitdata[u]['TIMECONF']['ORDERID']}`) {
          ordersetwitdata[u]['TIMECONF']['YIELD'] = datafinalset[g]['weight'];
          ordersetwitdata[u]['T_GOODSMOVEMENT'][0]['ENTRY_QNT'] = datafinalset[g]['weight'];
        }
      }

    }
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let apf = 0; apf < ordersetwitdata.length; apf++) {
      if (ordersetwitdata[apf]['TIMECONF']['YIELD'] != '') {
        console.log(ordersetwitdata[apf]);

        let saprp = await axios.post(
          `http://172.23.10.168:14094/03iPPGETDATACHEM/SETI005DATA`,
          ordersetwitdata[apf]
        )
        console.log(`${JSON.stringify(ordersetwitdata[apf])}`.replaceAll('"','').replaceAll(',',' '));
        await mssqlR.qureyR(`INSERT INTO [SOI8LOG].[dbo].[autosmlog] ([sendtext], [returntext]) VALUES ( '${JSON.stringify(ordersetwitdata[apf]).replaceAll('"','').replaceAll(',',' ')}', '${JSON.stringify(saprp).replaceAll('"','').replaceAll(',',' ')}' )`);
         console.log(saprp);
        await delay(2000);



      }

    }

    output = ordersetwitdata;

    // output = { "return": "OK" };

  }
  catch (err) {
    output = { "return": "NOK" };
  }
  return res.json(output);
});


module.exports = router;