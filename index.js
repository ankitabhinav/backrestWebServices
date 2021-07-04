require('dotenv').config();
const express = require ('express')
const mongoose =require ('mongoose')
const bodyParser = require ('body-parser')
const sendEmailRouter = require('./routes/sendEmail');
const registerUserRouter = require('./routes/register');
const createNewFirmRouter = require('./routes/createFirm');
const verifyAccountRouter = require('./routes/verifyAccount')
const cors = require('cors');
const app = express();

app.use(bodyParser.json()); 
app.use(cors());

app.use('/email',sendEmailRouter);
app.use('/register',registerUserRouter);
app.use('/createNewFirm',createNewFirmRouter);
app.use('/verify',verifyAccountRouter)


// init mongoose
mongoose.connect( `${process.env.MONGO_URI}`, {useNewUrlParser: true,  useUnifiedTopology: true })
.then(() => console.log("connected successfully"))
.catch((err) => {return console.error("Could not connect:", err)} );

app.get('/', (req,res) => {
    console.log('------------');
    res.send('hello this is backrest web services ');
});

const port=process.env.PORT || 3000

app.listen(port, ()=> console.log(`listning on port ${port}`));
