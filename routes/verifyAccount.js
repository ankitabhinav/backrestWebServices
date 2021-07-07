const express = require('express');
const verifyAccountRouter = express.Router();
const bcrypt = require('bcrypt');
//Create a firmsModel model just by requiring the module
const firmsModel = require('../schemas/firm');
const usersModel = require('../schemas/user')
const myLogger = require('../Logger');
const sendVerificationEmail = require('../SendEmail')
const jwt = require('jsonwebtoken');
const path = require('path');


verifyAccountRouter.get('/firm/verifyAccount', (req, res) => {

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
                            return res.sendFile(path.join(__dirname, '../views/verifySuccess.html'))
                            //return res.status(200).send({ success: true, status: "Account verified successfully" });
                        }
                    });
            }

        } catch (err) {
            console.log(err);
            return res.sendFile(path.join(__dirname, '../views/verifyFailed.html'))
            //return res.status(500).send({ success: false, status: err ? err : "something went wrong" });
        }

    }
    verifyAccount();


});

verifyAccountRouter.get('/user/verifyAccount', (req, res) => {

    console.log(req.query);

    if (!req.query.token) {
        return res.status(400).send({ success: false, status: 'verification token is not present' });
    }

    async function verifyAccount() {

        try {

            let decodedToken = await jwt.verify(req.query.token, process.env.BACKREST_KEY);
            let fetchUser = await usersModel.findOne({
                name: decodedToken.ownerName,
                firmName: decodedToken.firmName,
                email: decodedToken.email
            });

            if (!fetchUser) {
                return res.status(400).send({ success: false, status: "This user is not registered with us" });
            } else {
                usersModel.findByIdAndUpdate(fetchUser._id, { isVerified: true },
                    function (err, docs) {
                        if (err) {
                            console.log(err);
                            return res.render('../views/verifyFailed.ejs', { message: 'Account verification failed' });
                        }
                        else {
                            console.log("Updated User : ", docs);
                            return res.render('../views/verifySuccess.ejs', { message: 'Account verified successfully' });
                            //return res.status(200).send({ success: true, status: "Account verified successfully" });
                        }
                    });
            }

        } catch (err) {
            console.log(err);
            return res.render('../views/verifyFailed.ejs', { message: 'Something went wrong' });
            //return res.status(500).send({ success: false, status: err ? err : "something went wrong" });
        }

    }
    verifyAccount();


});

module.exports = verifyAccountRouter;