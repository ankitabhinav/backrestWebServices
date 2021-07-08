require('dotenv').config();
const express = require ('express')
const mongoose =require ('mongoose')
const bodyParser = require ('body-parser')
const sendEmailRouter = require('./routes/sendEmail');
const registerUserRouter = require('./routes/register');
const createNewFirmRouter = require('./routes/createFirm');
const verifyAccountRouter = require('./routes/verifyAccount');
const resetPasswordRouter = require('./routes/resetPassword');
const loginRouter = require('./routes/loginRouter')
const cors = require('cors');
const app = express();
const Logger = require('./Logger');
const path = require('path');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const dashboardRouter = require('./routes/dashboard');
//const cookieSession = require('cookie-session')
let globalSession = null; 
const oneDay = 1000 * 60 * 60 * 24;

var session;
app.use("/static", express.static('./static/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use(cors());
/* app.use(cookieSession({
    name: 'session',
    secret:process.env.SESSION_KEY,
    
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })) */
//app.use(session({secret: process.env.SESSION_KEY,saveUninitialized: true,resave: false,cookie: { secure: false }}));
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use('/email',sendEmailRouter);
app.use('/register',registerUserRouter);
app.use('/createNewFirm',createNewFirmRouter);
app.use('/verify',verifyAccountRouter);
app.use('/login', loginRouter);
app.use('/reset',resetPasswordRouter);
app.use('/firm/dashboard', dashboardRouter)



// init mongoose
mongoose.connect( `${process.env.MONGO_URI}`, {useNewUrlParser: true,  useUnifiedTopology: true })
.then(() => console.log("connected successfully"))
.catch((err) => {return console.error("Could not connect:", err)} );

app.get('/', (req,res) => {
    
    //res.send('hello this is backrest web services ');
    return res.render('../views/home.ejs', { message: 'User details not found' });
});


const port=process.env.PORT || 3000

app.listen(port, ()=> console.log(`listning on port ${port}`));
