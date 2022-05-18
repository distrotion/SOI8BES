const e = require("express");
const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');

let PREMIXserver = 'PREMIX_MASTER';
let COILCOATINGserver = 'COILCOATING_MASTER';
let HYDROPHILICserver = 'HYDROPHILIC_MASTER';
let PLXserver = 'PLX_MASTER';
let TRITRATINGserver = 'TRITRATING_MASTER';
let POWDERserver = 'POWDER_MASTER';
let LIQUIDserver = 'LIQUID_MASTER';
let dbin = 'specification';

let PREMIXdbMAIN = 'PREMIXdbMAIN';
let COILCOATINGdbMAIN = 'COILCOATINGdbMAIN';
let HYDROPHILICdbMAIN = 'HYDROPHILICdbMAIN';
let PLXdbMAIN = 'PLXdbMAIN';
let TRITRATINGdbMAIN = 'TRITRATINGdbMAIN';
let POWDERdbMAIN = 'POWDERdbMAIN';
let LIQUIDdbMAIN = 'LIQUIDdbMAIN';
let dbinMAIN = 'MAIN'

const d = new Date();
let day = d;

router.post('/RegisterPO', async (req, res) => {
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let MATCP = input['PO'].substring(0, 8);
    let PO = input['PO'].substring(12, 18);

    let PREMIX = await mongodb.find(PREMIXserver,dbin,{"MATNO":MATCP});
    let COILCOATING = await mongodb.find(COILCOATINGserver,dbin,{"MATNO":MATCP});
    let HYDROPHILIC = await mongodb.find(HYDROPHILICserver,dbin,{"MATNO":MATCP});
    let PLX = await mongodb.find(PLXserver,dbin,{"MATNO":MATCP});
    let TRITRATING = await mongodb.find(TRITRATINGserver,dbin,{"MATNO":MATCP});
    let POWDER = await mongodb.find(POWDERserver,dbin,{"MATNO":MATCP});
    let LIQUID = await mongodb.find(LIQUIDserver,dbin,{"MATNO":MATCP});

    let data = {
        "PLANT":"NOdata",
        "STATUS":"ORDER AGAIN"
    };

    if(TRITRATING.length > 0){
        data = {
            "MATCP":MATCP,
            "PO":PO,
            "PLANT":"TRITRATING",
            "MASTERdb":TRITRATINGserver,
            "MATDATA":TRITRATING[0],
            "ProductName":TRITRATING[0]['ProductName'],
        };
    }else if(COILCOATING.length > 0){
        data = {
            "MATCP":MATCP,
            "PO":PO,
            "PLANT":"COILCOATING",
            "MASTERdb":COILCOATINGserver,
            "MATDATA":COILCOATING[0],
            "ProductName":COILCOATING[0]['ProductName'],
        };
    }else if(HYDROPHILIC.length > 0){
        data = {
            "MATCP":MATCP,
            "PO":PO,
            "PLANT":"HYDROPHILIC",
            "MASTERdb":HYDROPHILICserver,
            "MATDATA":HYDROPHILIC[0],
            "ProductName":HYDROPHILIC[0]['ProductName'],
        };
    }else if(PLX.length > 0){
        data = {
            "MATCP":MATCP,
            "PO":PO,
            "PLANT":"PLX",
            "MASTERdb":PLXserver,
            "MATDATA":PLX[0],
            "ProductName":PLX[0]['ProductName'],
        };
    }else if(PREMIX.length > 0){
        data = {
            "MATCP":MATCP,
            "PO":PO,
            "PLANT":"PREMIX",
            "MASTERdb":PREMIXserver,
            "MATDATA":PREMIX[0],
            "ProductName":PREMIX[0]['ProductName'],
        };
    }else if(POWDER.length > 0){
        data = {
            "MATCP":MATCP,
            "PO":PO,
            "PLANT":"POWDER",
            "MASTERdb":POWDERserver,
            "MATDATA":POWDER[0],
            "ProductName":POWDER[0]['ProductName'],
        };
    }
    else if(LIQUID.length > 0){
        data = {
            "MATCP":MATCP,
            "PO":PO,
            "PLANT":"LIQUID",
            "MASTERdb":LIQUIDserver,
            "MATDATA":LIQUID[0],
            "ProductName":LIQUID[0]['ProductName'],
        };
    }

    let neworder={
        "POID":input['PO'],
        "MATNO":MATCP,
        "PO":PO,
        "PLANT":data["PLANT"],
        "MASTERdb":data["MASTERdb"],
        "ProductName":data["ProductName"],
        "SumStatus" : "IP",
        "DEP":"STAFF"
    };

    let output = 'The order Incorrect';

    if(data["PLANT"]!=="NOdata"){
        // console.log(Object.keys(data["MATDATA"]["SPEC"]))
        let INSlist = Object.keys(data["MATDATA"]["SPEC"]);
        let checklist = [];
        for(i=0;i<INSlist.length;i++){
            
            if(INSlist[i] === 'COLOR'){
                checklist.push(INSlist[i]);
                neworder['COLOR'] = {
                    "SPEC" : data["MATDATA"]["SPEC"]["COLOR"],
                    "T1" : "",
                    "T1St" : "",
                    "T1Stc" : "orange",
                    "T2" : "",
                    "T2St" : "",
                    "T2Stc" : "orange",
                    "T3" : "",
                    "T3St" : "",
                    "T3Stc" : "orange",
                    "AllSt" : "IP",
                    "T1Stc_comment" : "",
                    "T2Stc_comment" : "",
                    "T3Stc_comment" : "",
                }
            }else if(INSlist[i] === 'APPEARANCE'){
                checklist.push(INSlist[i])
                neworder['APPEARANCE'] = {
                    "SPEC" : data["MATDATA"]["SPEC"]["APPEARANCE"],
                    "T1" : "",
                    "T1St" : "",
                    "T1Stc" : "orange",
                    "T2" : "",
                    "T2St" : "",
                    "T2Stc" : "orange",
                    "T3" : "",
                    "T3St" : "",
                    "T3Stc" : "orange",
                    "AllSt" : "IP",
                    "T1Stc_comment" : "",
                    "T2Stc_comment" : "",
                    "T3Stc_comment" : "",
                }
            }else{
                if((data["MATDATA"]["SPEC"][`${INSlist[i]}`]["HI"] !== "")&&(data["MATDATA"]["SPEC"][`${INSlist[i]}`]["LOW"] !== "")){
                    checklist.push(INSlist[i])
                    neworder[`${INSlist[i]}`] = {
                        "SPEC" : data["MATDATA"]["SPEC"][`${INSlist[i]}`],
                        "T1" : "",
                        "T1St" : "",
                        "T1Stc" : "orange",
                        "T2" : "",
                        "T2St" : "",
                        "T2Stc" : "orange",
                        "T3" : "",
                        "T3St" : "",
                        "T3Stc" : "orange",
                        "AllSt" : "IP",
                        "T1Stc_comment" : "",
                        "T2Stc_comment" : "",
                        "T3Stc_comment" : "",
                    }
                }
            }
        }

        let check = await mongodb.find(`${neworder['PLANT']}dbMAIN`,'MAIN',{"POID":neworder['POID'] });

        if(check.length === 0){
            console.log("<<<<<<<")
            neworder['time'] = check.length+1;
            neworder['date'] = day;
            neworder['checklist'] =checklist;
            var ins = await mongodb.insertMany(`${neworder['PLANT']}dbMAIN`,'MAIN',[neworder]);
            output = `The order have added to PLANT:${data["PLANT"]}`;
        }else{
            // let upd = await mongodb.update(`${neworder['PLANT']}dbMAIN`,'MAIN',{ "POID":neworder['POID'] }, { $set: neworder });
            
            let check2 = await mongodb.find(`${neworder['PLANT']}dbMAIN`,'MAIN',{$and:[{"POID":neworder['POID']},{$or:[{ "DEP": "MANA" },{ "DEP": "STAFF" }]}]});
            if(check2.length === 0){
                neworder['time'] = check.length+1;
                neworder['date'] = day;
                neworder['checklist'] =checklist;
                var ins2 = await mongodb.insertMany(`${neworder['PLANT']}dbMAIN`,'MAIN',[neworder]);
            console.log(">>>>>>>")
                output = `The order have added to PLANT:${data["PLANT"]}`;
              
            }else{
                output = `The order have already had in DB`;
            }
            
        }
        
    }else{

    }
    

    res.json(output);
});

router.post('/rejectitem', async (req, res) => {
    ///-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let poid = `${input['PO']}`
    let ID = `${input['ID']}`
    let plant = '';

    let output = { "return": 'NOK' };
    let PREMIX = await mongodb.find(PREMIXdbMAIN, dbinMAIN, { $and: [ { "POID": poid },{ "DEP": "STAFF" }] }); //{ "SumStatus": "IP" }, { "DEP": "STAFF" }
    if (PREMIX.length > 0) {
        plant='PREMIX';
    }
    let COILCOATING = await mongodb.find(COILCOATINGdbMAIN, dbinMAIN, { $and: [ { "POID": poid },{ "DEP": "STAFF" }] });
    if (COILCOATING.length > 0) {
        plant='COILCOATING';
    }
    let HYDROPHILIC = await mongodb.find(HYDROPHILICdbMAIN, dbinMAIN, { $and: [ { "POID": poid },{ "DEP": "STAFF" }] });
    if (HYDROPHILIC.length > 0) {
        plant='HYDROPHILIC';
    }
    let PLX = await mongodb.find(PLXdbMAIN, dbinMAIN, { $and: [ { "POID": poid },{ "DEP": "STAFF" }] });
    if (PLX.length > 0) {
        plant='PLX';
    }
    let TRITRATING = await mongodb.find(TRITRATINGdbMAIN, dbinMAIN, { $and: [ { "POID": poid },{ "DEP": "STAFF" }] });
    if (TRITRATING.length > 0) {
        plant='TRITRATING';
    }

    let POWDER = await mongodb.find(POWDERdbMAIN, dbinMAIN, { $and: [ { "POID": poid },{ "DEP": "STAFF" }] });
    if (POWDER.length > 0) {
        plant='POWDER';
    }
    let LIQUID = await mongodb.find(LIQUIDdbMAIN, dbinMAIN, { $and: [ { "POID": poid },{ "DEP": "STAFF" }] });
    if (LIQUID.length > 0) {
        plant='LIQUID';
    }

    console.log(plant);

    let find01 = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { $and: [ { "POID": poid }] }); 

    let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [ { "POID": poid },{$or:[{ "DEP": "MANA" },{ "DEP": "STAFF" }]}] }, { $set: {"time":find01.length,"SumStatus":"REJECT","DEP": "REJECT","STAFF-REJECT":ID } });

    let find = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { $and: [ { "POID": poid } , { "SumStatus":"REJECT" }] }); 
    if(find.length > 0){
        output = { "return": 'OK' }
    }


    res.json(output);
});

module.exports = router;