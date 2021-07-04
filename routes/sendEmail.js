const express = require('express');
const sendEmailRouter = express.Router();
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt');
//var usersModel = require('../schema/user');
const sgMail = require('@sendgrid/mail')


sendEmailRouter.post('/sendVerifyEmail', (req, res) => {

    let templates = {
        confirm_account : "d-70de87794d3c4cecbab4b1d5dbcaff4c",
        reset_password:"d-9405b92c29f5444f86ff17273db63444"
    };


    async function sendEmail() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: 'ankit.abhinav.19@gmail.com', // Change to your recipient
            from: 'backrest_team@outlook.com', // Change to your verified sender
            subject: 'Confirm your BillSplit account ',
            //text: 'and easy to do anywhere, even with Node.js',
            templateId: templates['confirm_account'],
            dynamic_template_data: {
                Client_Name: "Ankit",
                Sender_Name: "Backrest Web Services",
                Sender_Address: "backrest.netlify.com",
                Verify_Link: "https://billsplitweb.netlify.com",//replace with your verification link
                Company_Logo:"https://billsplitweb.netlify.app/android-icon-192x192.png", //replace with your company logo
                Company_Name:"Bill Split",
                Company_Tag_Line:"Simplifying expense tracking",
                Support_Email:"cfcindia@outlook.com",
                Reset_Link:"www.google.com",
                User_Email:"ankit.abhinav.19@gmail.com"
            }
            //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        }
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent');
                return res.status(200).send({ message: 'verification email sent' });
            })
            .catch((error) => {
                console.error(error);
                return res.status(400).send({ message: 'verification email failed' });

            })
    }
    sendEmail();


});

sendEmailRouter.post('/sendPasswordResetEmail', (req, res) => {

    let templates = {
        confirm_account : "d-70de87794d3c4cecbab4b1d5dbcaff4c",
        reset_password:"d-9405b92c29f5444f86ff17273db63444"
    };


    async function sendEmail() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: 'ankitabhinav1234@mailinator.com', // Change to your recipient
            from: 'backrest_team@outlook.com', // Change to your verified sender
            subject: 'Confirm your BillSplit account ',
            //text: 'and easy to do anywhere, even with Node.js',
            templateId: templates['reset_password'],
            dynamic_template_data: {
                Client_Name: "Ankit",
                Sender_Name: "Backrest Web Services",
                Sender_Address: "backrest.netlify.com",
                Verify_Link: "https://billsplitweb.netlify.com",//replace with your verification link
                Company_Logo:"https://billsplitweb.netlify.app/android-icon-192x192.png", //replace with your company logo
                Company_Name:"Bill Split",
                Company_Tag_Line:"Simplifying expense tracking",
                Support_Email:"cfcindia@outlook.com",
                Reset_Link:"www.google.com",
                User_Email:"ankit.abhinav.19@gmail.com"
            }
            //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        }
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent');
                return res.status(200).send({ message: 'verification email sent' });
            })
            .catch((error) => {
                console.error(error);
                return res.status(400).send({ message: 'verification email failed' });

            })
    }
    sendEmail();


});

module.exports = sendEmailRouter;