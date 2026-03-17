const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');

let PREMIXdbMAIN = 'PREMIXdbMAIN';
let COILCOATINGdbMAIN = 'COILCOATINGdbMAIN';
let HYDROPHILICdbMAIN = 'HYDROPHILICdbMAIN';
let PLXdbMAIN = 'PLXdbMAIN';
let TRITRATINGdbMAIN = 'TRITRATINGdbMAIN';
let POWDERdbMAIN = 'POWDERdbMAIN';
let LIQUIDdbMAIN = 'LIQUIDdbMAIN';
let NOXRUSTdbMAIN = 'NOXRUSTdbMAIN'
let dbin = 'specification';
let dbinMAIN = 'MAIN'

router.post('/getliststaff', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------

    let output = [];

    try {

        const [PREMIX, COILCOATING, HYDROPHILIC, PLX, TRITRATING, POWDER, LIQUID, NOXRUST] = await Promise.all([
            mongodb.find(PREMIXdbMAIN, dbinMAIN, { "DEP": "STAFF" }),
            mongodb.find(COILCOATINGdbMAIN, dbinMAIN, { "DEP": "STAFF" }),
            mongodb.find(HYDROPHILICdbMAIN, dbinMAIN, { "DEP": "STAFF" }),
            mongodb.find(PLXdbMAIN, dbinMAIN, { "DEP": "STAFF" }),
            mongodb.find(TRITRATINGdbMAIN, dbinMAIN, { "DEP": "STAFF" }),
            mongodb.find(POWDERdbMAIN, dbinMAIN, { "DEP": "STAFF" }),
            mongodb.find(LIQUIDdbMAIN, dbinMAIN, { "DEP": "STAFF" }),
            mongodb.find(NOXRUSTdbMAIN, dbinMAIN, { "DEP": "STAFF" }),
        ]);
        output.push(...PREMIX, ...COILCOATING, ...HYDROPHILIC, ...PLX, ...TRITRATING, ...POWDER, ...LIQUID, ...NOXRUST);

        for (let i = 0; i <output.length; i++) {
            // console.log(output[i]['checklist']);
            let passcount = 0;
            for (let j = 0; j < output[i]['checklist'].length; j++) {

                if (output[i][output[i]['checklist'][j]]['AllSt'] === 'PASS') {
                    passcount++;
                } else if (output[i][output[i]['checklist'][j]]['AllSt'] === 'REJECT') {
                    output[i]['SumStatus'] = 'REJECT'

                    let upd = await mongodb.update(`${output[i]['PLANT']}dbMAIN`, 'MAIN', { $and: [{ "POID": output[i]['POID'] }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: { "SumStatus": "REJECT", "DEP": "REJECT" } });
                }
                //REJECT



            };

            if (passcount === output[i]['checklist'].length) {
                output[i]['SumStatus'] = 'ALL-PASS'
                let upd = await mongodb.update(`${output[i]['PLANT']}dbMAIN`, 'MAIN', { $and: [{ "POID": output[i]['POID'] }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: { "SumStatus": "ALL-PASS" } });
            }

        };

        // console.log(output);

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/getlistmana', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------

    let output = [];

    try {

        const [PREMIX, COILCOATING, HYDROPHILIC, PLX, TRITRATING, POWDER, LIQUID, NOXRUST] = await Promise.all([
            mongodb.find(PREMIXdbMAIN, dbinMAIN, { "DEP": "MANA" }),
            mongodb.find(COILCOATINGdbMAIN, dbinMAIN, { "DEP": "MANA" }),
            mongodb.find(HYDROPHILICdbMAIN, dbinMAIN, { "DEP": "MANA" }),
            mongodb.find(PLXdbMAIN, dbinMAIN, { "DEP": "MANA" }),
            mongodb.find(TRITRATINGdbMAIN, dbinMAIN, { "DEP": "MANA" }),
            mongodb.find(POWDERdbMAIN, dbinMAIN, { "DEP": "MANA" }),
            mongodb.find(LIQUIDdbMAIN, dbinMAIN, { "DEP": "MANA" }),
            mongodb.find(NOXRUSTdbMAIN, dbinMAIN, { "DEP": "MANA" }),
        ]);
        output.push(...PREMIX, ...COILCOATING, ...HYDROPHILIC, ...PLX, ...TRITRATING, ...POWDER, ...LIQUID, ...NOXRUST);

    }
    catch (err) {
        output = [];
    }


    res.json(output);
});


router.post('/getone', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];

    try {

        let poid = `${input['poid']}`



        const [PREMIX, COILCOATING, HYDROPHILIC, PLX, TRITRATING, POWDER, LIQUID, NOXRUST] = await Promise.all([
            mongodb.find(PREMIXdbMAIN, dbinMAIN, { "POID": poid, "DEP": "SCADA" }),
            mongodb.find(COILCOATINGdbMAIN, dbinMAIN, { "POID": poid, "DEP": "SCADA" }),
            mongodb.find(HYDROPHILICdbMAIN, dbinMAIN, { "POID": poid, "DEP": "SCADA" }),
            mongodb.find(PLXdbMAIN, dbinMAIN, { "POID": poid, "DEP": "SCADA" }),
            mongodb.find(TRITRATINGdbMAIN, dbinMAIN, { "POID": poid, "DEP": "SCADA" }),
            mongodb.find(POWDERdbMAIN, dbinMAIN, { "POID": poid, "DEP": "SCADA" }),
            mongodb.find(LIQUIDdbMAIN, dbinMAIN, { "POID": poid, "DEP": "SCADA" }),
            mongodb.find(NOXRUSTdbMAIN, dbinMAIN, { "POID": poid, "DEP": "SCADA" }),
        ]);
        output.push(...PREMIX, ...COILCOATING, ...HYDROPHILIC, ...PLX, ...TRITRATING, ...POWDER, ...LIQUID, ...NOXRUST);

    }
    catch (err) {
        output = [];
    }
    
    res.json(output);
});

module.exports = router;