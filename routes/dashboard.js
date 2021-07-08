const express = require('express');
const dashboardRouter = express.Router();
const bcrypt = require('bcrypt');
//Create a usersModel model just by requiring the module
const usersModel = require('../schemas/user');
const allLogsModel = require('../schemas/allLogs')
const firmsModel = require('../schemas/firm');
const myLogger = require('../Logger');
const sendVerificationEmail = require('../SendEmail')
const mongoose = require('mongoose');

dashboardRouter.get('/', (req, res) => {

    sess= req.session;

    if (!sess.email) return res.render('../views/signin.ejs');
   
    return res.render('../views/dashboard/home.ejs',{sess})


});

dashboardRouter.get('/firm_details', (req, res) => {

    sess= req.session;

    if (!sess.email) return res.render('../views/signin.ejs');
   
    return res.render('../views/dashboard/firmDetails.ejs',{sess})


});

dashboardRouter.get('/users', (req, res) => {

    sess= req.session;

    if (!sess.email) return res.render('../views/signin.ejs');

    const getAllUsers = async() => {
        try {
            let allUsers = await usersModel.find({firmId:sess.firmId}, {password:0, privateKey:0}).sort({date:-1});
            console.log(allUsers);
            if(allUsers.length == 0) {
                return res.render('../views/dashboard/users.ejs',{sess,users:[]})
            }
    
            return res.render('../views/dashboard/users.ejs',{sess,users:allUsers})
        } catch(err) {
            console.log(err)
        }
    }
    getAllUsers();
    
});

dashboardRouter.get('/logs', (req, res) => {

    sess= req.session;

    if (!sess.email) return res.render('../views/signin.ejs');

    const getLogs = async() => {
        try {
            let allLogs = await allLogsModel.find({'details.firmId':mongoose.Types.ObjectId(sess.firmId)}).sort({date:-1});
            console.log(allLogs);
            if(allLogs.length == 0) {
                return res.render('../views/dashboard/logs.ejs',{sess,logs:[]})
            }
    
            return res.render('../views/dashboard/logs.ejs',{sess,logs:allLogs})
        } catch(err) {
            console.log(err)
        }
    }
    getLogs();
   


});

dashboardRouter.get('/settings', (req, res) => {

    sess= req.session;

    if (!sess.email) return res.render('../views/signin.ejs');
   
    return res.render('../views/dashboard/settings.ejs',{sess})


});

module.exports = dashboardRouter;