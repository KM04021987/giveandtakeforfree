require('dotenv').config();

const ibmdb = require('ibm_db');
let connStr = "DATABASE="+process.env.DB_DATABASE+";HOSTNAME="+process.env.DB_HOSTNAME+";PORT="+process.env.DB_PORT+";UID="+process.env.DB_UID+";PWD="+process.env.DB_PWD+";PROTOCOL=TCPIP;SECURITY=SSL";


let postContactQueries = (postmessage) => {
    console.log('homepageService: postContactQueries')
    return new Promise(async (resolve, reject) => {
        ibmdb.open(connStr, function (err, conn) {
            if (err) throw err;
            conn.query("INSERT INTO "+process.env.DB_SCHEMA+".GT_ASK_QUESTION (PERSON_FULLNAME, PERSON_EMAIL, QUESTION_DETAILS) values(?, ?, ?);", [postmessage.fullname, postmessage.email, postmessage.messagecontent],  function(err, rows) {
                if (err) {
                    reject(err)
                }
                resolve("Successfully posted the queries");
            })
        });
    });
}

module.exports = {
    postContactQueries: postContactQueries
};