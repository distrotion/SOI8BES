const e = require("express");
const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');

const d = new Date();
let day = d;


router.post('/passtomana', async (req, res) => {

    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = { "return": 'NOK' }
    let poid = `${input['poid']}`
    let ID = `${input['ID']}`
    let plant = input['plant']
    let SENDTOMANAdate= day;

    let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { "POID": poid }, { $set: {"DEP":"MANA","SENDTOMANAdate":SENDTOMANAdate,"STAFF":ID} });

    let find = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { $and: [ { "POID": poid } , { "DEP": "MANA" }] }); 
    if(find.length > 0){
        output = { "return": 'OK' }
    }


    res.json(output);
});

router.post('/passtoscada', async (req, res) => {

    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = { "return": 'NOK' }
    let poid = `${input['poid']}`
    let ID = `${input['ID']}`
    let plant = input['plant']
    let SENDTOSCADAdate= day;

    let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { "POID": poid }, { $set: {"DEP":"SCADA","SENDTOSCADAdate":SENDTOSCADAdate,"MGR":ID} });



    let find = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { $and: [ { "POID": poid } , { "DEP": "SCADA" }] }); 
    if(find.length > 0){
        output = { "return": 'OK' }
        request.post(
            'http://127.0.0.1:2500/new_scada_premix',
            {
                json: {
                    "poid": poid,
                }
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                }
            }
        );
    }
    


    res.json(output);
});

router.post('/passtoscadare', async (req, res) => {

    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = { "return": 'NOK' }
    let poid = `${input['poid']}`
    let ID = `${input['ID']}`
    let plant = input['plant']
    let SENDTOSCADAdateRE= day;

    let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { "POID": poid }, { $set: {"DEP":"SCADA","SENDTOSCADAdateRE":SENDTOSCADAdateRE,"RE-STAFF":ID} });

    let find = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { $and: [ { "POID": poid } , { "DEP": "SCADA" }] }); 
    if(find.length > 0){
        output = { "return": 'OK' }
        request.post(
            'http://127.0.0.1:2500/new_scada_premix',
            {
                json: {
                    "poid": poid,
                }
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                }
            }
        );
    }
    


    res.json(output);
});


router.post('/rejectitem', async (req, res) => {

    let output = { "return": 'NOK' }
    let poid = `${input['poid']}`
    let plant = input['plant']

    let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { "POID": poid }, { $set: {"DEP":"REJECT"} });


    res.json(output);
});

router.post('/completetitem', async (req, res) => {

    let output = { "return": 'NOK' }
    let poid = `${input['poid']}`
    let plant = input['plant']

    let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { "POID": poid }, { $set: {"DEP":"COMPLETE"} });


    res.json(output);
});



module.exports = router;