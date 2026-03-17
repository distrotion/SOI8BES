const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');
let mssql = require('./../../function/mssql');

let PREMIXserver = 'PREMIX_MASTER';
let COILCOATINGserver = 'COILCOATING_MASTER';
let HYDROPHILICserver = 'HYDROPHILIC_MASTER';
let PLXserver = 'PLX_MASTER';
let TRITRATINGserver = 'TRITRATING_MASTER';
let POWDERserver = 'POWDER_MASTER';
let LIQUIDserver = 'LIQUID_MASTER';
let NOXRUSTserver = 'NOXRUST_MASTER'
let dbin = 'specification';

let PREMIXdbMAIN = 'PREMIXdbMAIN';
let COILCOATINGdbMAIN = 'COILCOATINGdbMAIN';
let HYDROPHILICdbMAIN = 'HYDROPHILICdbMAIN';
let PLXdbMAIN = 'PLXdbMAIN';
let TRITRATINGdbMAIN = 'TRITRATINGdbMAIN';
let POWDERdbMAIN = 'POWDERdbMAIN';
let LIQUIDdbMAIN = 'LIQUIDdbMAIN';
let NOXRUSTdbMAIN = 'NOXRUSTdbMAIN';
let dbinMAIN = 'MAIN'


router.post('/gethistoryplant', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
    let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];
    try {
        let plant = input['plant']



        let find = await mongodb.find(`${plant}_MASTER`, 'specification', {});
        if (find.length > 0) {
            // output = { "return": 'OK' }
            for (let i = 0; i < find.length; i++) {
                output.push({ "MATNO": find[i]['MATNO'], "ProductName": find[i]['ProductName'], })
            }

        }

    }
    catch (err) {
        output = [];
    }


    res.json(output);
});


router.post('/gethistory', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
    let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------

    let output = { "re": "NOK" }

    try {

        let outdata = [];
        let MATCP = `${input['MATCP']}`
        let plant = input['plant']



        let find = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { $and: [{ "MATNO": MATCP }] });
        console.log(find);
        if (find.length > 0) {
            // output = find;

            output['checklist'] = find[0]['checklist'] ?? [];
            for (let i = 0; i < find.length; i++) {

                var databuff = {
                    "POID": find[i]['POID'],
                    "MATNO": find[i]['MATNO'],
                    "PO": find[i]['PO'],
                    "ProductName": find[i]['ProductName'],
                    "SumStatus": find[i]['SumStatus'],
                    "DEP": find[i]['DEP'],
                }

                for (let j = 0; j < output['checklist'].length; j++) {
                    databuff[`P${j}_T1`] = find[i][`${output['checklist'][j]}`]['T1'] ?? ``;
                    databuff[`P${j}_T2`] = find[i][`${output['checklist'][j]}`]['T2'] ?? ``;
                    databuff[`P${j}_T3`] = find[i][`${output['checklist'][j]}`]['T3'] ?? ``;
                }



                outdata.push(databuff);
            }
            output["re"] = 'OK'
        }

        output['outdata'] = outdata;
        // console.log(output);
    }
    catch (err) {
        output = { "re": "NOK" };
    }
    res.json(output);
});


router.post('/getweightlist', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
    let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];
    if (input['MATNO'] != undefined) {
        // let MATCP = input['PO'].substring(0, 8);
        let MATCP = input['MATNO']
        // let PO = input['PO'].substring(12, 18);

        let PREMIX = await mongodb.find(PREMIXserver, dbin, { "MATNO": MATCP });
        let COILCOATING = await mongodb.find(COILCOATINGserver, dbin, { "MATNO": MATCP });
        let HYDROPHILIC = await mongodb.find(HYDROPHILICserver, dbin, { "MATNO": MATCP });
        let PLX = await mongodb.find(PLXserver, dbin, { "MATNO": MATCP });
        let TRITRATING = await mongodb.find(TRITRATINGserver, dbin, { "MATNO": MATCP });
        let POWDER = await mongodb.find(POWDERserver, dbin, { "MATNO": MATCP });
        let LIQUID = await mongodb.find(LIQUIDserver, dbin, { "MATNO": MATCP });
        let NOXRUST = await mongodb.find(NOXRUSTserver, dbin, { "MATNO": MATCP });

        let data = {
            "PLANT": "NOdata",
            "STATUS": "ORDER AGAIN"
        };

        if (TRITRATING.length > 0) {

        } else if (COILCOATING.length > 0) {

        } else if (HYDROPHILIC.length > 0) {

        } else if (PLX.length > 0) {

        } else if (PREMIX.length > 0) {

        } else if (POWDER.length > 0) {

        } else if (LIQUID.length > 0) {
            let GETPO = await mongodb.findnolim(LIQUIDdbMAIN, dbinMAIN, { "MATNO": MATCP }, { "PO": 1 });

            const poParamObj = {};
            GETPO.forEach((item, i) => { poParamObj[`po${i}`] = item['PO']; });
            const poPlaceholders = GETPO.map((_, i) => `@po${i}`).join(',');

            let db = { recordsets: [[]] };
            if (GETPO.length > 0) {
                db = await mssql.qureyP(
                    `SELECT * FROM [ScadaReport].[dbo].[LQprocessinfo] WHERE NumOrder IN (${poPlaceholders}) ORDER BY NumOrder DESC, RecordTimeStart DESC`,
                    poParamObj
                );
            }
            // console.log(db['recordsets'][0]);
            let datadb = db['recordsets'][0];
            let StrChemicalList = [];
            let DATAOUTPUT = [];
            let start = 0;
            for (let i = 0; i < datadb.length; i++) {
                // console.log(datadb[i]['StrChemical']);

                if (datadb[i]['StrChemical'] === 'END') {
                    start++;
                }

                if (start === 1 && datadb[i]['StrChemical'] !== 'END') {
                    StrChemicalList.push(datadb[i]['StrChemical'].replace(" ", "").replace("    ", "").replace("\n", ""));
                } if (start > 1) {
                    break;
                }

            }

            for (let k = 0; k < polist.length; k++) {
                let newset = {

                };
                for (let s = 0; s < StrChemicalList.length; s++) {

                    for (let i = 0; i < datadb.length; i++) {

                        if (polist[k] === `'${datadb[i]['NumOrder']}'` && StrChemicalList[s] === datadb[i]['StrChemical'].replace(" ", "").replace("    ", "").replace("\n", "")) {
                            newset['RecordTimeStart'] = datadb[i]['RecordTimeStart'];
                            newset['PO'] = datadb[i]['NumOrder'];
                            newset['MATNO'] = input['MATNO'];
                            newset[StrChemicalList[s] + '_StrLotNum'] = datadb[i]['StrLotNum'];
                            newset[StrChemicalList[s] + '_StrBarcode'] = datadb[i]['StrBarcode'];
                            newset[StrChemicalList[s] + '_NumStep'] = datadb[i]['NumStep'];
                            newset[StrChemicalList[s] + '_NumSp'] = datadb[i]['NumSp'];
                            newset[StrChemicalList[s] + '_NumAct'] = datadb[i]['NumAct'];
                            newset[StrChemicalList[s] + '_NumTemp'] = datadb[i]['NumTemp'];

                            break;

                        }
                    }
                }
                DATAOUTPUT.push(newset);
            }

            output = {
                "list": StrChemicalList,
                "DATA": DATAOUTPUT
            };

        } else if (NOXRUST.length > 0) {

        } else {
            output = [];
        }



    }


    res.json(output);
});


router.post('/GetWeighBYTANK', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
    let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];
    try {
        if (input['TANK'] != undefined && input['STARTyear'] != undefined && input['STARTmonth'] != undefined && input['STARTday'] != undefined && input['ENDyear'] != undefined && input['ENDmonth'] != undefined && input['ENDday'] != undefined) {

            const db = await mssql.qureyP(
                `SELECT * FROM [ScadaReport].[dbo].[LQprocessinfo] WHERE StrChemical = 'END' AND StrLotNum = @tank AND RecordTimeStart BETWEEN @startdate AND @enddate ORDER BY RecordTimeStart DESC`,
                {
                    tank: input['TANK'],
                    startdate: `${input['STARTyear']}-${input['STARTmonth']}-${input['STARTday']} 00:00:00`,
                    enddate: `${input['ENDyear']}-${input['ENDmonth']}-${input['ENDday']} 23:59:59`
                }
            );

            let datadb = db['recordsets'][0];

            let orderlist = [];
            for (let i = 0; i < datadb.length; i++) {
                orderlist.push(datadb[i]['NumOrder']);
            }

            let queryoutss = [];
            if (orderlist.length > 0) {
                const ordParamObj = {};
                orderlist.forEach((val, i) => { ordParamObj[`ord${i}`] = val; });
                const ordPlaceholders = orderlist.map((_, i) => `@ord${i}`).join(',');
                const queryouts = await mssql.qureyP(
                    `SELECT * FROM [ScadaReport].[dbo].[LQprocessinfo] WHERE NumOrder IN (${ordPlaceholders}) ORDER BY NumOrder DESC, RecordTimeStart DESC`,
                    ordParamObj
                );
                queryoutss = queryouts['recordsets'][0];
            }

            // output = queryoutss;

            let StrChemicalList = [];
            let DATAOUTPUT = [];
            let start = 0

            for (let i = 0; i < queryoutss.length; i++) {
                // console.log(queryoutss[i]['StrChemical']);

                if (queryoutss[i]['StrChemical'] === 'END') {
                    start++;
                }

                if (start === 1 && queryoutss[i]['StrChemical'] !== 'END') {
                    StrChemicalList.push(queryoutss[i]['StrChemical'].replace(" ", "").replace("    ", "").replace("\n", ""));
                } if (start > 1) {
                    break;
                }

            }

            for (let k = 0; k < orderlist.length; k++) {
                let newset = {

                };
                for (let s = 0; s < StrChemicalList.length; s++) {

                    for (let i = 0; i < queryoutss.length; i++) {


                        // console.log(queryoutss[i]['NumOrder'])
                        if (`'${orderlist[k]}'` === `'${queryoutss[i]['NumOrder']}'` && StrChemicalList[s] === queryoutss[i]['StrChemical'].replace(" ", "").replace("    ", "").replace("\n", "")) {
                            // console.log("----->")
                            newset['RecordTimeStart'] = queryoutss[i]['RecordTimeStart'];
                            newset['PO'] = queryoutss[i]['NumOrder'];
                            newset['MATNO'] = input['MATNO'];
                            newset[StrChemicalList[s] + '_StrLotNum'] = queryoutss[i]['StrLotNum'];
                            newset[StrChemicalList[s] + '_StrBarcode'] = queryoutss[i]['StrBarcode'];
                            newset[StrChemicalList[s] + '_NumStep'] = queryoutss[i]['NumStep'];
                            newset[StrChemicalList[s] + '_NumSp'] = queryoutss[i]['NumSp'];
                            newset[StrChemicalList[s] + '_NumAct'] = queryoutss[i]['NumAct'];
                            newset[StrChemicalList[s] + '_NumTemp'] = queryoutss[i]['NumTemp'];

                            break;

                        }
                    }
                }
                DATAOUTPUT.push(newset);
            }

            // output = {
            //     "list": StrChemicalList,
            //     "DATA": DATAOUTPUT,
            //     // "listorder":orderlist
            // };
            output = DATAOUTPUT;



        }

    } catch (err) {
        console.error(err);
        output = { "list": [], "DATA": [] };
    }



    res.json(output);
});




module.exports = router;


// SELECT *
//   FROM [ScadaReport].[dbo].[LQprocessinfo] where StrChemical = 'END' and StrLotNum = 'RT03' and RecordTimeStart between '2023/12/01' and '2023/12/20' order by RecordTimeStart desc

// SELECT  *
//   FROM [ScadaReport].[dbo].[LQprocessinfo]  WHERE NumOrder in ('217885','217883','217816')  order by NumOrder  desc , RecordTimeStart desc