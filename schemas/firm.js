const mongoose = require('mongoose');

const generateRandomString = () => {
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(5);
}

const firmSchema = new mongoose.Schema({
    firmName: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
        unique: true
    },
    ownerName : {
        type: String,
        required:true,
        minLength: 5,
        maxLength: 255,
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
    phone: {
        type:String,
        required:false
    },
    date: { type: Date, default: Date.now },


});

module.exports = mongoose.model('firm', firmSchema);
