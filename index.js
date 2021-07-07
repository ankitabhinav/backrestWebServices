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

app.use("/static", express.static('./static/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cors());

app.use('/email',sendEmailRouter);
app.use('/register',registerUserRouter);
app.use('/createNewFirm',createNewFirmRouter);
app.use('/verify',verifyAccountRouter);
app.use('/login', loginRouter);
app.use('/reset',resetPasswordRouter);



// init mongoose
mongoose.connect( `${process.env.MONGO_URI}`, {useNewUrlParser: true,  useUnifiedTopology: true })
.then(() => console.log("connected successfully"))
.catch((err) => {return console.error("Could not connect:", err)} );

app.get('/', (req,res) => {
    console.log('------------');
    //res.send('hello this is backrest web services ');
    return res.sendFile(path.join(__dirname+'/views/signUp.html'))
});


const port=process.env.PORT || 3000

app.listen(port, ()=> console.log(`listning on port ${port}`));
