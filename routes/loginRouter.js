const express = require('express');
const loginRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//Create a usersModel model just by requiring the module
const usersModel = require('../schemas/user');
const firmsModel = require('../schemas/firm');
const loginSeesionsModel = require('../schemas/loginSessions')
const myLogger = require('../Logger');
const BACKREST_KEY = process.env.BACKREST_KEY;

loginRouter.post('/user', (req, res) => {

    //console.log(req.body);

    if (!req.body.email || !req.body.password || !req.body.firmId) {
        return res.status(400).send({ success: false, status: 'email and password, firmId fields are required' });
    }
    else {

        async function authUser() {

            try {
                let fetchUser = await usersModel.findOne({ email: req.body.email, firmId: req.body.firmId })
                if (!fetchUser) {
                    return res.status(400).send({ success: false, status: "user with email address attached to firm id does not exists" });
                }
                else {

                    let hashedPassword = fetchUser.password;
                    let plainPassword = req.body.password;

                    const comparePasswords = await bcrypt.compare(plainPassword, hashedPassword);

                    if (comparePasswords == true) {

                        /*  if (fetchUser.isActive == false) {
                             return res.status(400).send({ status: 'Verify your email address to continue' });
                         } else {
                             const token = jwt.sign({ id: fetchUser._id, email: fetchUser.email, name: fetchUser.name }, 'jwtPrivateKey');
                             return res.status(200).send({ status: 'login successful', jwt: token, name: fetchUser.name, email: fetchUser.email, profilePic: fetchUser.profilePic });
                         } */

                        const token = jwt.sign(
                            { _id: fetchUser._id, firmId: fetchUser.firmId, email: fetchUser.email, name: fetchUser.name, tokenType: 'token' },
                            BACKREST_KEY,
                            { expiresIn: 1800, issuer: 'backrest' }
                        );
                        const refreshToken = jwt.sign(
                            { _id: fetchUser._id, firmId: fetchUser.firmId, email: fetchUser.email, name: fetchUser.name, tokenType: 'refreshToken' },
                            BACKREST_KEY,
                            { expiresIn: 1800 * 5, issuer: 'backrest' }
                        );

                        let details = req.body.details ? req.body.details : {};

                        const newLoginSession = new loginSeesionsModel({
                            type: 'user',
                            name: fetchUser.name,
                            email: fetchUser.email,
                            firmId: req.body.firmId,
                            firmName: fetchUser.firmName,
                            details: details
                            /* details:{
                                platform:"web",
                                os:"chrome os 112234456.8956",
                                lat:"11.24",
                                long:"67.34",
                                location:"Ranchi,Jharkhand,India" 
                            } */
                        });

                        newLoginSession.save((err, session) => {
                            if (err) {
                                console.error(err);
                                return res.status(400).send({ success: false, status: "unable to create login session" });
                            } else {
                                myLogger('new_login_session', session);
                                console.log('login session created');
                                myLogger('user_login', fetchUser)
                                return res.status(200).send(
                                    {
                                        success: true,
                                        status: 'login successful',
                                        token: token,
                                        refreshToken: refreshToken,
                                        name: fetchUser.name,
                                        email: fetchUser.email,
                                        firmName: fetchUser.firmName,
                                        isVerified: fetchUser.isVerified,
                                        role: fetchUser.role,
                                        loginSession:session
                                    });
                            }
                        });
                    }
                    else {
                        return res.status(400).send({ success: false, status: 'password is incorrect' });
                    }
                }
            } catch (err) {
                console.log(err);
                return res.status(500).send({ success: false, status: err })
            }

        }
        authUser();
    }

});

module.exports = loginRouter;