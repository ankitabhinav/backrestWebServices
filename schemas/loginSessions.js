const mongoose = require('mongoose');

const generateRandomString = () => {
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(5);
}


const detailsSchema = new mongoose.Schema({ 
    platform:{
        type:String,
        required:false
    },
    os:{
        type:String,
        required:false
    },
    lat:{
        type:String,
        required:false
    },
    long:{
        type:String,
        required:false
    },
    location:{
        type:String,
        required:false
    } 
});

const loginSessionSchema = new mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255,
    },
    firmId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    firmName:{
        type:String,
        required:true
    },
    details:detailsSchema,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('loginSessions', loginSessionSchema);
