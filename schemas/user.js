const mongoose = require('mongoose');

const generateRandomString = () => {
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(5);
}

const userSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 3000
    },
    
    role: {
        type: String,
        required: false,
        default: 'client'
    },
    isVerified: {
        type: Boolean,
        required: false,
        default: false
    },
    isActive: {
        type:Boolean,
        required:false,
        default:true
    },
    privateKey : {
        type:String,
        required:true,
        default:generateRandomString()
    },
    firmId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    firmName:{
        type:String,
        required:true
    },
    date: { type: Date, default: Date.now },


});

module.exports = mongoose.model('user', userSchema);
