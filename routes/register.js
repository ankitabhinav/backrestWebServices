const express = require('express');
const registerRouter = express.Router();
const bcrypt = require('bcrypt');
//Create a usersModel model just by requiring the module
const usersModel = require('../schemas/user');
const allLogsModel = require('../schemas/allLogs')
const myLogger = require('../Logger')

registerRouter.post('/', (req, res) => {

    //console.log(req.body);

    if (!req.body.email || !req.body.password || !req.body.confirmPassword || !req.body.name || !req.body.firmName) {
        return res.status(400).send({ success: false, status: 'email, password, name, firm name, confirm password, name fields are required' });
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).send({ success: false, status: 'passwords do not match' });
    }


    async function createUser() {
        let fetchUser = await usersModel.findOne({ email: req.body.email, firmName: req.body.firmName })
        if (fetchUser) {
            return res.status(400).send({ success: false, status: "This email is already registered to this firm" });
        }
        else {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(req.body.password, salt);


                const newUser = new usersModel({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashed,
                    firmName: req.body.firmName
                });

                newUser.save((err, user) => {
                    if (err) {
                        console.error(err);
                        return res.status(400).send({ success: false, status: "user sign up failed" });
                    } else {
                        myLogger('user_register',user)
                        return res.status(201).send({ success: true, status: "User Created Successfully", user:user });
                    }
                });


            } catch (err) {
                console.log(err)
                return res.status(500).send({ success: false, status: "something went wrong" });
            }


            

        }
    }
    createUser();


});

module.exports = registerRouter;