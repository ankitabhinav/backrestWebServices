const express = require('express');
const resetPasswordRouter = express.Router();
const bcrypt = require('bcrypt');
//Create a firmsModel model just by requiring the module
const firmsModel = require('../schemas/firm');
const usersModel = require('../schemas/user')
const myLogger = require('../Logger');
const sendVerificationEmail = require('../SendEmail')
const jwt = require('jsonwebtoken');
const path = require('path');

resetPasswordRouter.post('/firm/resetPassword', (req,res) => {
    console.log(req.body.pass)
    return res.status(200).send({ success: true, status: req.body });
})


resetPasswordRouter.get('/firm/resetPassword', (req, res) => {

    console.log(req.query);

    if (!req.query.token) {
        return res.status(400).send({ success: false, status: 'verification token is not present' });
    }
    return res.render('../views/resetPassword.ejs',{token:req.query.token});



    async function resetPassword() {

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
    resetPassword();


});

resetPasswordRouter.get('/user/resetPassword', (req, res) => {

    console.log(req.query);

    if (!req.query.token) {
        return res.status(400).send({ success: false, status: 'verification token is not present' });
    }

    async function resetPassword() {

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
    resetPassword();


});

module.exports = resetPasswordRouter;