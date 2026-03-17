const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');
var request = require('request');




router.post('/passtomana', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;

    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = { "return": 'NOK' }
    try {

        let poid = `${input['poid']}`
        let ID = `${input['ID']}`
        let plant = input['plant']
        let SENDTOMANAdate = day;

        let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: { "DEP": "MANA", "SENDTOMANAdate": SENDTOMANAdate, "STAFF": ID } });

        let find = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { "DEP": "MANA" }] });
        if (find.length > 0) {
            output = { "return": 'OK' }
        }

    }
    catch (err) {
        console.error(err);
        output = { "return": 'NOK' }
    }


    res.json(output);
});

router.post('/returntostaff', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    console.log("returntostaff");
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = { "return": 'NOK' }
    try {

        let poid = `${input['poid']}`
        let ID = `${input['ID']}`
        let plant = input['plant']
        let RETURNTOSTAFFdate = day;

        let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: { "DEP": "STAFF", "RETURNTOSTAFFdate": RETURNTOSTAFFdate, "STAFF": ID } });

        let find = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { "DEP": "STAFF" }] });
        if (find.length > 0) {
            output = { "return": 'OK' }
        }

    }
    catch (err) {
        console.error(err);
        output = { "return": 'NOK' }
    }


    res.json(output);
});

router.post('/passtoscada', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
    let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = { "return": 'NOK' }
    try {
        let poid = `${input['poid']}`
        let ID = `${input['ID']}`
        let plant = input['plant']
        let SENDTOSCADAdate = day;

        let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: { "DEP": "SCADA", "SENDTOSCADAdate": SENDTOSCADAdate, "MGR": ID } });



        let find = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { "DEP": "SCADA" }] });
        if (find.length > 0) {
            console.log(`http://172.23.10.34:2500/new_scada_${plant}`);
            output = { "return": 'OK' }
            request.post(
                `http://172.23.10.34:2500/new_scada_${plant}`,
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

    }
    catch (err) {
        console.error(err);
        output = { "return": 'NOK' }
    }


    res.json(output);
});

router.post('/passtoscadare', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
    let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = { "return": 'NOK' }

    try {

        let poid = `${input['poid']}`
        let ID = `${input['ID']}`
        let plant = input['plant']
        let SENDTOSCADAdateRE = day;

        let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { "POID": poid }, { $set: { "DEP": "SCADA", "SENDTOSCADAdateRE": SENDTOSCADAdateRE, "RE-STAFF": ID } });
        let find = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { "DEP": "SCADA" }] });

        if (find.length > 0) {
            console.log(`http://172.23.10.34:2500/new_scada_${plant}`);
            output = { "return": 'OK' }
            request.post(
                `http://172.23.10.34:2500/new_scada_${plant}`,
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

    }
    catch (err) {
        console.error(err);
        output = { "return": 'NOK' }
    }


    res.json(output);
});


router.post('/completetitem', async (req, res) => {
    let input = req.body;
    let output = { "return": 'NOK' }

    try {

        let poid = `${input['poid']}`
        let plant = input['plant']
        let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { "POID": poid }, { $set: { "DEP": "COMPLETE" } });
        output = { "return": 'OK' }

    }
    catch (err) {
        console.error(err);
        output = { "return": 'NOK' }
    }
    res.json(output);
});



module.exports = router;