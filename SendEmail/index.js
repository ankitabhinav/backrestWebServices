const sgMail = require('@sendgrid/mail')
const jwt = require('jsonwebtoken');
const myLogger = require('../Logger');


const sendEmail = (to, clientName, firmName) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const BACKREST_KEY = process.env.BACKREST_KEY;

    const token = jwt.sign(
        { email: to, ownerName: clientName, firmName:firmName},
        BACKREST_KEY,
        { expiresIn: 1800, issuer: 'backrest' }
    );

    const msg = {
        to: to, // Change to your recipient
        from: 'backrest_team@outlook.com', // Change to your verified sender
        subject: 'Confirm your Backrest account ',
        //text: 'and easy to do anywhere, even with Node.js',
        templateId: "d-70de87794d3c4cecbab4b1d5dbcaff4c",
        dynamic_template_data: {
            Client_Name: clientName,
            Sender_Name: "Backrest Web Services",
            Sender_Address: "backrest.netlify.com",
            Verify_Link: `${process.env.BASE_URL}/verify/verifyBackrestAccount?token=${token}`,//replace with your verification link
            Company_Logo: "https://billsplitweb.netlify.app/android-icon-192x192.png", //replace with your company logo
            Company_Name: "Backrest Web Services",
            Company_Tag_Line: "Simplifying user authentication process",
            Support_Email: "backrest_team@outlook.com",
            //Reset_Link:"www.google.com",
            User_Email: to
        }
        //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent');
            myLogger('backrest_email_verify',{email:to, clientName:clientName, firmName:firmName})
            return res.status(200).send({ message: 'verification email sent' });
        })
        .catch((error) => {
            console.error(error);
            return res.status(400).send({ message: 'verification email failed' });

        })
}

module.exports = sendEmail;