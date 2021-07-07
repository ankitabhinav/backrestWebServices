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
const sendResetEmail = require('../SendEmail/resetEmail');

const BACKREST_KEY = process.env.BACKREST_KEY;

resetPasswordRouter.post('/firm/resetPassword', (req, res) => {
    console.log(req.body.pass)
    if (!req.body.pass || !req.body.re_pass || !req.body.token) {
        return res.status(400).send({ success: false, status: "fields not present cannot proceed" });
    }
    if(req.body.pass !== req.body.re_pass) {
        return res.status(400).send({ success: false, status: "passwords do not match" });
    }

    const resetPassword = async () => {
        try {
            let decodedToken = await jwt.verify(req.body.token, process.env.BACKREST_KEY);
            let fetchFirm = await firmsModel.findOne({ _id: decodedToken.firmId, firmName: decodedToken.firmName, email: decodedToken.email });
            if (!fetchFirm) {
                console.log('invalid details, firm not found');
                return res.render('../views/verifyFailed.ejs', { message: 'Firm details not found' });
                //return res.status(400).send({ success: false, status: "Invalid details" });
            } else {

                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(req.body.pass, salt);

                firmsModel.findByIdAndUpdate(fetchFirm._id, { password: hashed },
                    function (err, docs) {
                        if (err) {
                            myLogger('password_update_failed',fetchFirm)
                            console.log(err);
                            return res.render('../views/verifyFailed.ejs', { message: 'Something went wrong' });
                            //return res.status(500).send({ success: false, status: "Password Reset failed" });
                        }
                        else {
                            myLogger('password_update_success',docs)
                            console.log("Updated Firm : ", docs);
                            return res.render('../views/verifySuccess.ejs', { message: 'Password updated successfully' });
                            //return res.status(200).send({ success: true, status: "Account verified successfully" });
                        }
                    });
            }
        } catch (err) {
            console.log(err ? err : 'something went wrong');
            return res.render('../views/verifyFailed.ejs', { message: 'Something went wrong' });
        }
    }
    resetPassword();


})



resetPasswordRouter.post('/firm/forgotPassword', (req, res) => {
    console.log(req.body)
    if (!req.body.firmId) {
        return res.status(400).send({ success: false, status: 'firm Id is required' });
    }

    const generateResetToken = async () => {
        try {
            // let decodedToken = await jwt.verify(req.body.token, process.env.BACKREST_KEY);
            let fetchFirm = await firmsModel.findById(req.body.firmId);
            if (!fetchFirm) {
                return res.status(400).send({ success: false, status: "This firm is not registered with us" });
            } else {
                const token = jwt.sign(
                    { email: fetchFirm.email, ownerName: fetchFirm.ownerName, firmName: fetchFirm.firmName, firmId: fetchFirm._id },
                    BACKREST_KEY,
                    { expiresIn: '24h', issuer: 'backrest' }
                );
                console.log(token);

                sendResetEmail(
                    fetchFirm.email,
                    fetchFirm.ownerName,
                    token
                );

                return res.status(200).send({ success: true, status: "password reset link sent to registered email" });

            }
        } catch (err) {
            return res.status(500).send({ success: false, status: err ? err : "something went wrong" });
        }
    }
    generateResetToken();
})


resetPasswordRouter.get('/firm/resetPassword', (req, res) => {

    console.log(req.query);

    if (!req.query.token) {
        console.log("verification token not present");
        return res.render('../views/verifyFailed.ejs', { message: 'Invalid reset link, cannot proceed' });
        // return res.status(400).send({ success: false, status: 'verification token is not present' });
    }




    async function resetPassword() {

        try {
            let decodedToken = await jwt.verify(req.query.token, process.env.BACKREST_KEY);
            let fetchFirm = await firmsModel.findById(decodedToken.firmId);

            if (!fetchFirm) {
                return res.status(400).send({ success: false, status: "This firm is not registered with us" });
            } else {
                return res.render('../views/resetPassword.ejs', { token: req.query.token });
            }

        } catch (err) {
            console.log(err);
            return res.render('../views/verifyFailed.ejs', { message: 'Something went wrong' });
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
    resetPassword();


});

module.exports = resetPasswordRouter;