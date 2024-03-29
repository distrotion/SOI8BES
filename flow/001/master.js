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
let NOXRUSTserver = 'NOXRUST_MASTER'
let dbin = 'specification';

let COLORwords = 'COLORwords';
let APPEARANCEwords = 'APPEARANCEwords';


// const d = new Date();
// let day = d;


router.get('/flow001', async (req, res) => {

    res.json("testflow1");
});

router.post('/getpremixmaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    let output = [];
    try {

        output = await mongodb.find(PREMIXserver, dbin, {});
    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/uppremixmaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
    let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];

    try {

        let check = await mongodb.find(PREMIXserver, dbin, { "MATNO": input['MATNO'] });

        if (check.length === 0) {
            input['date'] = day;
            var ins = await mongodb.insertMany(PREMIXserver, dbin, [input]);
        } else {
            input['dateEdit'] = day;
            let upd = await mongodb.update(PREMIXserver, dbin, { "MATNO": input['MATNO'] }, { $set: input });
        }

        output = await mongodb.find(PREMIXserver, dbin, {});
    }
    catch (err) {
        output = [];
    }
    res.json(output);
});

router.post('/getcoilcoatingmaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
    let day = d;
    let output = [];

    try {

        output = await mongodb.find(COILCOATINGserver, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/upcoilcoatingmaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];

    try {

        let check = await mongodb.find(COILCOATINGserver, dbin, { "MATNO": input['MATNO'] });

        if (check.length === 0) {
            input['date'] = day;
            var ins = await mongodb.insertMany(COILCOATINGserver, dbin, [input]);
        } else {
            input['dateEdit'] = day;
            let upd = await mongodb.update(COILCOATINGserver, dbin, { "MATNO": input['MATNO'] }, { $set: input });
        }

        output = await mongodb.find(COILCOATINGserver, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});


router.post('/gethydrophilicmaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    let output = [];

    try {

        output = await mongodb.find(HYDROPHILICserver, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/uphydrophilicmaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];

    try {

        let check = await mongodb.find(HYDROPHILICserver, dbin, { "MATNO": input['MATNO'] });

        if (check.length === 0) {
            input['date'] = day;
            var ins = await mongodb.insertMany(HYDROPHILICserver, dbin, [input]);
        } else {
            input['dateEdit'] = day;
            let upd = await mongodb.update(HYDROPHILICserver, dbin, { "MATNO": input['MATNO'] }, { $set: input });
        }

        output = await mongodb.find(HYDROPHILICserver, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/getplxmaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    let output = [];

    try {

        output = await mongodb.find(PLXserver, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/upplxmaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];

    try {

        let check = await mongodb.find(PLXserver, dbin, { "MATNO": input['MATNO'] });

        if (check.length === 0) {
            input['date'] = day;
            var ins = await mongodb.insertMany(PLXserver, dbin, [input]);
        } else {
            input['dateEdit'] = day;
            let upd = await mongodb.update(PLXserver, dbin, { "MATNO": input['MATNO'] }, { $set: input });
        }

        output = await mongodb.find(PLXserver, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/gettritratingmaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    let output = [];

    try {

        output = await mongodb.find(TRITRATINGserver, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/uptritratingmaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];

    try {

        let check = await mongodb.find(TRITRATINGserver, dbin, { "MATNO": input['MATNO'] });

        if (check.length === 0) {
            input['date'] = day;
            var ins = await mongodb.insertMany(TRITRATINGserver, dbin, [input]);
        } else {
            input['dateEdit'] = day;
            let upd = await mongodb.update(TRITRATINGserver, dbin, { "MATNO": input['MATNO'] }, { $set: input });
        }

        output = await mongodb.find(TRITRATINGserver, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/getpowdermaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    let output = [];

    try {

        output = await mongodb.find(POWDERserver, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/uppowdermaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];

    try {

        let check = await mongodb.find(POWDERserver, dbin, { "MATNO": input['MATNO'] });

        if (check.length === 0) {
            input['date'] = day;
            var ins = await mongodb.insertMany(POWDERserver, dbin, [input]);
        } else {
            input['dateEdit'] = day;
            let upd = await mongodb.update(POWDERserver, dbin, { "MATNO": input['MATNO'] }, { $set: input });
        }

        output = await mongodb.find(POWDERserver, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/getliquidmaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    let output = [];

    try {

        output = await mongodb.find(LIQUIDserver, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/upliquidmaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];

    try {

        let check = await mongodb.find(LIQUIDserver, dbin, { "MATNO": input['MATNO'] });

        if (check.length === 0) {
            input['date'] = day;
            var ins = await mongodb.insertMany(LIQUIDserver, dbin, [input]);
        } else {
            input['dateEdit'] = day;
            let upd = await mongodb.update(LIQUIDserver, dbin, { "MATNO": input['MATNO'] }, { $set: input });
        }

        output = await mongodb.find(LIQUIDserver, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/getnoxrustmaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    let output = [];

    try {

        output = await mongodb.find(NOXRUSTserver, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/upnoxrustmaster', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];

    try {

        let check = await mongodb.find(NOXRUSTserver, dbin, { "MATNO": input['MATNO'] });

        if (check.length === 0) {
            input['date'] = day;
            var ins = await mongodb.insertMany(NOXRUSTserver, dbin, [input]);
        } else {
            input['dateEdit'] = day;
            let upd = await mongodb.update(NOXRUSTserver, dbin, { "MATNO": input['MATNO'] }, { $set: input });
        }

        output = await mongodb.find(NOXRUSTserver, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});


router.post('/selectcolor', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];

    try {

        output = await mongodb.find(COLORwords, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/upselectcolor', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];

    try {

        let check = await mongodb.find(COLORwords, dbin, { "WID": input['WID'] });

        if (check.length === 0) {

            let check2 = await mongodb.find(COLORwords, dbin, { $and: [{ "value": input['value'] }, { "plant": input['plant'] }] });
            if (check2.length > 0) {

            } else {
                input['WID'] = `WIDC-${Date.now()}`;
                var ins = await mongodb.insertMany(COLORwords, dbin, [input]);
            }


        } else {
            //
            let upd = await mongodb.update(COLORwords, dbin, { "WID": input['WID'] }, { $set: { "value": input['value'], "code": input['code'], "plant": input['plant'] } });
        }

        output = await mongodb.find(COLORwords, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/selectappearance', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];

    try {

        output = await mongodb.find(APPEARANCEwords, dbin, {});
        // console.log(output);

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

router.post('/upselectappearance', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];

    try {

        let check = await mongodb.find(APPEARANCEwords, dbin, { "WID": input['WID'] });

        if (check.length === 0) {
            let check2 = await mongodb.find(APPEARANCEwords, dbin, { $and: [{ "value": input['value'] }, { "plant": input['plant'] }] });

            if (check2.length > 0) {

            } else {
                input['WID'] = `WIDA-${Date.now()}`;
                var ins = await mongodb.insertMany(APPEARANCEwords, dbin, [input]);
            }

        } else {
            //
            let upd = await mongodb.update(APPEARANCEwords, dbin, { "WID": input['WID'] }, { $set: { "value": input['value'], "code": input['code'], "plant": input['plant'] } });
        }

        output = await mongodb.find(APPEARANCEwords, dbin, {});

    }
    catch (err) {
        output = [];
    }

    res.json(output);
});

//NOXRUST

router.post('/selectdropdown', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = {};

    try {

        let output1 = await mongodb.find(COLORwords, dbin, { "plant": input['plant'] });
        let output2 = await mongodb.find(APPEARANCEwords, dbin, { "plant": input['plant'] });
        let output3 = await mongodb.find('INSTRUMENT', 'data', {});

        output = {
            "CO": output1,
            "AP": output2,
            "PREMIX": output3[0]['PREMIX'],
            "COILCOATING": output3[0]['COILCOATING'],
            "HYDROPHILIC": output3[0]['HYDROPHILIC'],
            "PLX": output3[0]['PLX'],
            "TRITRATING": output3[0]['TRITRATING'],
            "POWDER": output3[0]['POWDER'],
            "LIQUID": output3[0]['LIQUID'],
            "NOXRUST": output3[0]['NOXRUST'],
        }

    }

    catch (err) {
        output = {};
    }
    res.json(output);
});


module.exports = router;
