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



router.post('/valueinput', async (req, res) => {
    console.log("valueinput");
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------

    let output = { "return": 'NOK' }
    try {


        let poid = `${input['poid']}`
        let plant = input['plant']
        let item = input['item']
        let value = `${input['value']}`

        let query = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] });


        if (query.length > 0) {
            // output = {"return":'OK'}
            // console.log(query[0][item] === null);

            if (query[0][item] === undefined) {
                console.log("NO HAVE WOY");
            } else {
                if (query[0][item]['T1Stc'] === 'lightgreen' || query[0][item]['T2Stc'] === 'lightgreen' || query[0][item]['T3Stc'] === 'lightgreen') {
                    //
                    output = { "return": 'WOK' }
                } else {
                    let veT = '';
                    let veTSt = '';
                    let veTStc = '';

                    if (query[0][item]['T1Stc'] === 'orange') {
                        veT = 'T1';
                        veTSt = 'T1St';
                        veTStc = 'T1Stc';
                    } else if (query[0][item]['T2Stc'] === 'orange') {
                        veT = 'T2';
                        veTSt = 'T2St';
                        veTStc = 'T2Stc';
                    } else if (query[0][item]['T3Stc'] === 'orange') {
                        veT = 'T3';
                        veTSt = 'T3St';
                        veTStc = 'T3Stc';
                    } else {
                        veT = '';
                        veTSt = '';
                        veTStc = '';
                    }
                    if (veT !== '') {
                        // console.log(query[0][item]);
                        let setupdate = query[0][item];
                        if (item == 'COLOR' || item == 'APPEARANCE') {
                            //                   
                            let valueAC = value.toUpperCase();
                            let val = `${setupdate['SPEC']}`.toUpperCase();
                            let valueACdata = value;
                            let valdata = `${setupdate['SPEC']}`;
                            //.includes('')
                            //if(val.includes(valueAC)){
                            if (val.includes('-') || val.includes('to')) {

                                if (val.includes(valueAC) == false) {
                                    // if(valueAC != val){
                                    setupdate[veT] = `${valueACdata}`;
                                    setupdate[veTSt] = 'M';
                                    setupdate[veTStc] = 'red';
                                    console.log("NO PASS");
                                    if (veTStc === 'T3Stc') {
                                        setupdate['AllSt'] = 'REJECT'
                                        setupdate['DEP'] = 'REJECT'
                                    }
                                    //------------------------------------
                                    let updv = {};
                                    updv[item] = setupdate;


                                    let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: updv });
                                    output = { "return": 'OK' }
                                    //------------------------------------
                                    // }else if(valueAC == val){
                                } else if (val.includes(valueAC)) {
                                    console.log("PASS");
                                    setupdate[veT] = `${valueACdata}`;
                                    setupdate[veTSt] = 'M';
                                    setupdate[veTStc] = 'lightgreen';
                                    setupdate['AllSt'] = 'PASS';
                                    console.log("PASS");
                                    //------------------------------------
                                    let updv = {};
                                    updv[item] = setupdate;

                                    let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: updv });
                                    output = { "return": 'OK' }
                                    //------------------------------------
                                }

                            } else {

                                if (valueAC != val) {
                                    setupdate[veT] = `${valueACdata}`
                                    setupdate[veTSt] = 'M'
                                    setupdate[veTStc] = 'red'
                                    console.log("NO PASS");
                                    if (veTStc === 'T3Stc') {
                                        setupdate['AllSt'] = 'REJECT'
                                        setupdate['DEP'] = 'REJECT'
                                    }
                                    //------------------------------------
                                    let updv = {};
                                    updv[item] = setupdate;


                                    let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: updv });
                                    output = { "return": 'OK' }
                                    //------------------------------------
                                } else if (valueAC == val) {
                                    console.log("PASS");
                                    setupdate[veT] = `${valueACdata}`
                                    setupdate[veTSt] = 'M'
                                    setupdate[veTStc] = 'lightgreen'
                                    setupdate['AllSt'] = 'PASS'
                                    console.log("PASS");
                                    //------------------------------------
                                    let updv = {};
                                    updv[item] = setupdate;

                                    let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: updv });
                                    output = { "return": 'OK' }
                                    //------------------------------------
                                }

                            }



                        } else {
                            //
                            let valueAC = parseFloat(value);
                            let valueORI = value;
                            let MIN = parseFloat(setupdate['SPEC']['LOW']);
                            let MAX = parseFloat(setupdate['SPEC']['HI']);

                            console.log(`${MIN}<${valueAC}<${MAX}`);
                            if (valueAC < MIN || valueAC > MAX) {

                                setupdate[veT] = valueORI;
                                setupdate[veTSt] = 'M';
                                setupdate[veTStc] = 'red';
                                console.log("NO PASS");

                                if (veTStc === 'T3Stc') {
                                    setupdate['AllSt'] = 'REJECT'
                                    setupdate['DEP'] = 'REJECT'
                                }
                                //------------------------------------
                                let updv = {};
                                updv[item] = setupdate;

                                let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: updv });
                                output = { "return": 'OK' }
                                //------------------------------------
                            } else if (valueAC >= MIN && valueAC <= MAX) {
                                console.log("PASS");
                                setupdate[veT] = valueORI;
                                setupdate[veTSt] = 'M';
                                setupdate[veTStc] = 'lightgreen';
                                setupdate['AllSt'] = 'PASS';
                                console.log("PASS");

                                //------------------------------------
                                let updv = {};
                                updv[item] = setupdate;

                                let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: updv });
                                output = { "return": 'OK' }
                                //------------------------------------
                            }


                        }
                    }

                }
            }



        }
    }
    catch (err) {
        output = { "return": 'NOK' }
    }
    res.json(output);
});




router.post('/semiauto-valueinputget', async (req, res) => {
    console.log("semiauto-valueinputget");
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = { "return": 'NOK' }
    try {



        let MATCP = input['poid'].substring(0, 8);
        let PO = input['poid'].substring(12, 18);
        let poid = `${input['poid']}`

        let PREMIX = await mongodb.find(PREMIXserver, dbin, { "MATNO": MATCP });
        let COILCOATING = await mongodb.find(COILCOATINGserver, dbin, { "MATNO": MATCP });
        let HYDROPHILIC = await mongodb.find(HYDROPHILICserver, dbin, { "MATNO": MATCP });
        let PLX = await mongodb.find(PLXserver, dbin, { "MATNO": MATCP });
        let TRITRATING = await mongodb.find(TRITRATINGserver, dbin, { "MATNO": MATCP });
        let POWDER = await mongodb.find(POWDERserver, dbin, { "MATNO": MATCP });
        let LIQUID = await mongodb.find(LIQUIDserver, dbin, { "MATNO": MATCP });
        let NOXRUST = await mongodb.find(NOXRUSTserver, dbin, { "MATNO": MATCP });

        let plant = ``;

        if (TRITRATING.length > 0) {
            plant = 'TRITRATING'

        } else if (COILCOATING.length > 0) {
            plant = 'COILCOATING'

        } else if (HYDROPHILIC.length > 0) {
            plant = 'HYDROPHILIC'

        } else if (PLX.length > 0) {
            plant = 'PLX'

        } else if (PREMIX.length > 0) {
            plant = 'PREMIX'

        } else if (POWDER.length > 0) {
            plant = 'POWDER'

        }
        else if (LIQUID.length > 0) {
            plant = 'LIQUID'

        } else if (NOXRUST.length > 0) {
            plant = 'NOXRUST'

        } else{
            res.json(output);
        }

        let output1 = await mongodb.find(COLORwords, dbin, { "plant": plant });
        let output2 = await mongodb.find(APPEARANCEwords, dbin, { "plant": plant });

        let query = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { "POID": poid });
        if (query.length > 0) {
            output = query[0];
            output['CO'] = output1;
            output['AP'] = output2;
            output["return"] = 'OK';
        }

        // console.log(output);
    }
    catch (err) {
        output = { "return": 'NOK' }
    }
    res.json(output);
});


router.post('/valueinputadj', async (req, res) => {
    console.log("valueinputadj");
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = { "return": 'NOK' }
    try {


        let poid = `${input['poid']}`
        let plant = input['plant']
        let item = input['item']
        let value = `${input['value']}`

        let query = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] });

        if (query.length > 0) {
            if (query[0][item] === undefined) {
                console.log("NO HAVE WOY");
            } else if (query[0][item]['T1Stc'] === 'lightgreen' || query[0][item]['T2Stc'] === 'lightgreen' || query[0][item]['T3Stc'] === 'lightgreen') {
                let veT = '';
                let veTSt = '';
                let veTStc = '';

                if (query[0][item]['T1Stc'] === 'orange') {
                    veT = 'T1';
                    veTSt = 'T1St';
                    veTStc = 'T1Stc';
                } else if (query[0][item]['T2Stc'] === 'orange') {
                    veT = 'T2';
                    veTSt = 'T2St';
                    veTStc = 'T2Stc';
                } else if (query[0][item]['T3Stc'] === 'orange') {
                    veT = 'T3';
                    veTSt = 'T3St';
                    veTStc = 'T3Stc';
                } else {
                    veT = '';
                    veTSt = '';
                    veTStc = '';
                }
                if (veT !== '') {
                    // console.log(query[0][item]);
                    let setupdate = query[0][item];
                    if (item == 'COLOR' || item == 'APPEARANCE') {
                        //                   
                        let valueAC = value.toUpperCase();
                        let val = `${setupdate['SPEC']}`.toUpperCase();
                        let valueACdata = value;
                        let valdata = `${setupdate['SPEC']}`;

                        if (val.includes('-') || val.includes('to')) {

                            if (val.includes(valueAC) == false) {
                                // if(valueAC != val){
                                setupdate[veT] = `${valueACdata}`
                                setupdate[veTSt] = 'M-ADJ'
                                setupdate[veTStc] = 'red'
                                console.log("NO PASS");
                                if (veTStc === 'T3Stc') {
                                    setupdate['AllSt'] = 'REJECT'
                                    setupdate['DEP'] = 'REJECT'
                                }
                                //------------------------------------
                                let updv = {};
                                updv[item] = setupdate;


                                let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: updv });
                                output = { "return": 'OK' }
                                //------------------------------------
                                // }else if(valueAC == val){
                            } else if (val.includes(valueAC)) {
                                console.log("PASS");
                                setupdate[veT] = `${valueACdata}`
                                setupdate[veTSt] = 'M-ADJ'
                                setupdate[veTStc] = 'lightgreen'
                                setupdate['AllSt'] = 'PASS'
                                console.log("PASS");
                                //------------------------------------
                                let updv = {};
                                updv[item] = setupdate;

                                let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: updv });
                                output = { "return": 'OK' }
                                //------------------------------------
                            }

                        } else {

                            if (valueAC != val) {
                                setupdate[veT] = `${valueACdata}`
                                setupdate[veTSt] = 'M-ADJ'
                                setupdate[veTStc] = 'red'
                                console.log("NO PASS");
                                if (veTStc === 'T3Stc') {
                                    setupdate['AllSt'] = 'REJECT'
                                    setupdate['DEP'] = 'REJECT'
                                }
                                //------------------------------------
                                let updv = {};
                                updv[item] = setupdate;


                                let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: updv });
                                output = { "return": 'OK' }
                                //------------------------------------
                            } else if (valueAC == val) {
                                console.log("PASS");
                                setupdate[veT] = `${valueACdata}`
                                setupdate[veTSt] = 'M-ADJ'
                                setupdate[veTStc] = 'lightgreen'
                                setupdate['AllSt'] = 'PASS'
                                console.log("PASS");
                                //------------------------------------
                                let updv = {};
                                updv[item] = setupdate;

                                let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: updv });
                                output = { "return": 'OK' }
                                //------------------------------------
                            }

                        }



                    } else {
                        //
                        let valueAC = parseFloat(value);
                        let valueORI = value;
                        let MIN = parseFloat(setupdate['SPEC']['LOW']);
                        let MAX = parseFloat(setupdate['SPEC']['HI']);

                        console.log(`${MIN}<${valueAC}<${MAX}`);
                        if (valueAC < MIN || valueAC > MAX) {

                            setupdate[veT] = valueORI;
                            setupdate[veTSt] = 'M-ADJ'
                            setupdate[veTStc] = 'red'
                            console.log("NO PASS");

                            if (veTStc === 'T3Stc') {
                                setupdate['AllSt'] = 'REJECT'
                                setupdate['DEP'] = 'REJECT'
                            }
                            //------------------------------------
                            let updv = {};
                            updv[item] = setupdate;

                            let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: updv });
                            output = { "return": 'OK' }
                            //------------------------------------
                        } else if (valueAC >= MIN && valueAC <= MAX) {
                            console.log("PASS");
                            setupdate[veT] = valueORI;
                            setupdate[veTSt] = 'M-ADJ'
                            setupdate[veTStc] = 'lightgreen'
                            setupdate['AllSt'] = 'PASS'
                            console.log("PASS");

                            //------------------------------------
                            let updv = {};
                            updv[item] = setupdate;

                            let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: updv });
                            output = { "return": 'OK' }
                            //------------------------------------
                        }


                    }

                }
            } else {
                output = { "return": 'WOK' }
            }



        }
    }
    catch (err) {
        output = { "return": 'NOK' }
    }

    res.json(output);

});

module.exports = router;