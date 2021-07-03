require('dotenv').config();
const express = require ('express')
//const mongoose =require ('mongoose')
const bodyParser = require ('body-parser')
const sendEmailRouter = require('./routes/sendEmail')
const cors = require('cors');
const app = express();

app.use(bodyParser.json()); 
app.use(cors());

app.use('/email',sendEmailRouter);

app.get('/', (req,res) => {
    console.log('------------');
    res.send('hello this is backrest web services ');
});

const port=process.env.PORT || 3000

app.listen(port, ()=> console.log(`listning on port ${port}`));
