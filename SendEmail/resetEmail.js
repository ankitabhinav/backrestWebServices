const sgMail = require('@sendgrid/mail')
const jwt = require('jsonwebtoken');
const myLogger = require('../Logger');


const sendEmail = (
    to,
    clientName,
    token,
    firmName = "Backrest Web Services",
    companyLogo = "https://billsplitweb.netlify.app/android-icon-192x192.png",
    companyTagLine = "Simplifying user authentication process",
    supportEmail = "backrest_team@outlook.com",
    verifyType = "firm"
) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: to, // Change to your recipient
        from: 'backrest_team@outlook.com', // Change to your verified sender
        subject: `Confirm your ${firmName} account`,
        //text: 'and easy to do anywhere, even with Node.js',
        templateId: "d-9405b92c29f5444f86ff17273db63444",
        dynamic_template_data: {
            Client_Name: clientName,
            Sender_Name: "Backrest Web Services",
            Sender_Address: "backrest.netlify.com",
            Reset_Link: `${process.env.BASE_URL}/reset/${verifyType}/resetPassword?token=${token}`,//replace with your verification link
            Company_Logo: companyLogo, //replace with your company logo
            Company_Name: firmName,
            Company_Tag_Line: companyTagLine,
            Support_Email: supportEmail,
            //Reset_Link:"www.google.com",
            User_Email: to
        }
        //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent');
            myLogger('firm_password_reset_email', { email: to, clientName: clientName, firmName: firmName })

            return;//return res.status(200).send({ message: 'verification email sent' });
        })
        .catch((error) => {
            return console.error(error);
            //return res.status(400).send({ message: 'verification email failed' });

        })
}



module.exports = sendEmail;