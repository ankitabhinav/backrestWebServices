const allLogsModel = require('../schemas/allLogs')

const myLogger = (type,data) => {
    try {
        let newData = data;
        delete newData.password;
        delete newData.privateKey;
        const newLog = new allLogsModel({
            type:type,
            details:newData
        }) 
        newLog.save((err,log) => {
            if(err) console.log(err);
        })
    } catch(err) {

    }
}

module.exports = myLogger;