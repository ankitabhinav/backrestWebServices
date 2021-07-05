const express = require('express');
const registerRouter = express.Router();
const bcrypt = require('bcrypt');
//Create a usersModel model just by requiring the module
const usersModel = require('../schemas/user');
const allLogsModel = require('../schemas/allLogs')
const firmsModel = require('../schemas/firm');
const myLogger = require('../Logger');
const sendVerificationEmail = require('../SendEmail')

registerRouter.post('/', (req, res) => {

    //console.log(req.body);

    if (!req.body.email || !req.body.password || !req.body.confirmPassword || !req.body.name || !req.body.firmId) {
        return res.status(400).send({ success: false, status: 'email, password, name, firm Id confirm password, name fields are required' });
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).send({ success: false, status: 'passwords do not match' });
    }


    async function createUser() {
        try {
            let fetchFirm = await firmsModel.findById(req.body.firmId);
            let fetchUser = await usersModel.findOne({ email: req.body.email, firmId: req.body.firmId });

            if (fetchUser) {
                return res.status(400).send({ success: false, status: "This email is already registered to this firm" });
            }
            if (!fetchFirm) {
                return res.status(400).send({ success: false, status: "This firm is not registered with us" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            const newUser = new usersModel({
                name: req.body.name,
                email: req.body.email,
                password: hashed,
                firmName: req.body.firmName,
                firmId: req.body.firmId
            });

            newUser.save((err, user) => {
                if (err) {
                    console.error(err);
                    return res.status(400).send({ success: false, status: "user sign up failed" });
                } else {
                    myLogger('user_register', user);
                    sendVerificationEmail(
                        user.email,
                        user.name,
                        user.firmName,
                        "https://i.ibb.co/WpyLZv5/monkey.png",
                        "This a company tag line, replace with yours",
                        "backrest_team@outlook.com",
                        "user"
                    );
                    return res.status(201).send({ success: true, status: "User Created Successfully", user: user });
                }
            });


        } catch (err) {
            console.log(err)
            return res.status(500).send({ success: false, status: err ? err : "something went wrong" });
        }


    }
    createUser();


});

module.exports = registerRouter;