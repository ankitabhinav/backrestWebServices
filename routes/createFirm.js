const express = require('express');
const registerRouter = express.Router();
const bcrypt = require('bcrypt');
//Create a firmsModel model just by requiring the module
const firmsModel = require('../schemas/firm');
const myLogger = require('../Logger');
const sendVerificationEmail = require('../SendEmail')

registerRouter.post('/', (req, res) => {

    //console.log(req.body);

    if (!req.body.email || !req.body.password || !req.body.confirmPassword || !req.body.ownerName || !req.body.firmName || !req.body.companyLogo) {
        return res.status(400).send({ success: false, status: 'email, password, ownerName, firmName, confirm password,compamyLogo fields are required' });
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).send({ success: false, status: 'passwords do not match' });
    }


    async function createNewFirm() {
        let fetchUser = await firmsModel.findOne({ownerName:req.body.ownerName, firmName: req.body.firmName })
        if (fetchUser) {
            return res.status(400).send({ success: false, status: "This firm and its owner is already registered with us" });
        }
        else {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(req.body.password, salt);


                const newFirm = new firmsModel({
                    ownerName: req.body.ownerName,
                    email: req.body.email,
                    password: hashed,
                    firmName: req.body.firmName,
                    companyLogo:req.body.companyLogo
                });

                newFirm.save((err, firm) => {
                    if (err) {
                        console.error(err);
                        return res.status(400).send({ success: false, status: "Failed" });
                    } else {
                        myLogger('new_firm',firm);
                        sendVerificationEmail(firm.email,firm.ownerName,firm.firmName);
                        return res.status(201).send({ success: true, status: "Firm Created Successfully"});
                    }
                });


            } catch (err) {
                console.log(err)
                return res.status(500).send({ success: false, status: "something went wrong" });
            }

        }
    }
    createNewFirm();


});

module.exports = registerRouter;