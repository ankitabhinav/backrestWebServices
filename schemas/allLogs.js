const mongoose = require('mongoose');

const allLogsSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    details : {
        type:mongoose.Schema.Types.Mixed,
        default:{empty:false}
    },

    date: { type: Date, default: Date.now },


});

module.exports = mongoose.model('alllogs', allLogsSchema);
