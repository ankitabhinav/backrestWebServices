const express = require('express');
const verifyAccountRouter = express.Router();
const bcrypt = require('bcrypt');
//Create a firmsModel model just by requiring the module
const firmsModel = require('../schemas/firm');
const myLogger = require('../Logger');
const sendVerificationEmail = require('../SendEmail')
const jwt = require('jsonwebtoken');


verifyAccountRouter.get('/verifyBackrestAccount', (req, res) => {

    console.log(req.query);

    if (!req.query.token) {
        return res.status(400).send({ success: false, status: 'verification token is not present' });
    }



    async function verifyAccount() {

        try {

            let decodedToken = await jwt.verify(req.query.token, process.env.BACKREST_KEY);
            let fetchFirm = await firmsModel.findOne({
                ownerName: decodedToken.ownerName,
                firmName: decodedToken.firmName,
                email: decodedToken.email
            });

            if (!fetchFirm) {
                return res.status(400).send({ success: false, status: "This firm and its owner is not registered with us" });
            } else {
                firmsModel.findByIdAndUpdate(fetchFirm._id, { isVerified: true },
                    function (err, docs) {
                        if (err) {
                            console.log(err);
                            return res.status(500).send({ success: false, status: "Account verification failed" });
                        }
                        else {
                            console.log("Updated User : ", docs);
                            return res.status(200).send({ success: true, status: "Account verified successfully" });
                        }
                    });
            }

        } catch (err) {
            console.log(err);
            return res.status(500).send({ success: false, status: err ? err : "something went wrong" });
        }

    }
    verifyAccount();


});

module.exports = verifyAccountRouter;