require('dotenv').config();
const ibmdb = require('ibm_db');
let connStr = "DATABASE="+process.env.DB_DATABASE+";HOSTNAME="+process.env.DB_HOSTNAME+";PORT="+process.env.DB_PORT+";UID="+process.env.DB_UID+";PWD="+process.env.DB_PWD+";PROTOCOL=TCPIP;SECURITY=SSL";
let nodeGeocoder = require('node-geocoder');

let createPickupRequestWithFile = (data, cloudinary_public_id, cloudinary_secure_url) => {
    console.log('profileService: createPickupRequestWithFile')
    return new Promise(async (resolve, reject) => {
        let options = {
            provider: 'openstreetmap'
        };
        let geoCoder = nodeGeocoder(options);

        let fulladdress = data.state;
        fulladdress += ', ';
        fulladdress += data.country;
        fulladdress += ', ';
        fulladdress += data.pin;

        geoCoder.geocode(fulladdress).then((res)=> {
            let row = res[0];
            const jsonData = JSON.stringify(row)
            const removebracket1 = jsonData.replace('[','')
            const removebracket2 = removebracket1.replace(']','')
            const jsonParseobj = JSON.parse(removebracket2)
            const platitude = jsonParseobj.latitude
            const plongitude = jsonParseobj.longitude
            const pcountry = jsonParseobj.country
            const pstate = jsonParseobj.state
            const ppin = jsonParseobj.zipcode

            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                if(pcountry === data.country && pstate === data.state && ppin === data.pin)  {
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".ITEM_INFO(GIVER_ACCOUNT, ITEM_CATEGORY, ITEM_SUBCATEGORY, ITEM_NAME, GIVER_COUNTRY, GIVER_STATE, GIVER_CITY, GIVER_PIN_OR_ZIP, GIVER_ADDRESS, GIVER_PHONE_NO, IMAGE_CLOUDINARY_PUBLIC_ID, IMAGE_CLOUDINARY_SECURE_URL, GIVER_LATITUDE, GIVER_LONGITUDE) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [data.account, data.category, data.subcategory, data.itemname, data.country, data.state, data.city, data.pin, data.address, data.phone, cloudinary_public_id, cloudinary_secure_url, platitude, plongitude], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Successfully Created a new pickup request(With File)");
                })
                } else {
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".ITEM_INFO(GIVER_ACCOUNT, ITEM_CATEGORY, ITEM_SUBCATEGORY, ITEM_NAME, GIVER_COUNTRY, GIVER_STATE, GIVER_CITY, GIVER_PIN_OR_ZIP, GIVER_ADDRESS, GIVER_PHONE_NO, IMAGE_CLOUDINARY_PUBLIC_ID, IMAGE_CLOUDINARY_SECURE_URL) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [data.account, data.category, data.subcategory, data.itemname, data.country, data.state, data.city, data.pin, data.address, data.phone, cloudinary_public_id, cloudinary_secure_url], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Successfully Created a new pickup request(With File)");
                })  
                } 
            });
        })
        .catch((err)=> {
            console.log(err);
        });
    });
};

let createPickupRequestWithoutFile = (data) => {
    console.log('profileService: createPickupRequestWithoutFile')
    return new Promise(async (resolve, reject) => {
        let options = {
            provider: 'openstreetmap'
        };
        let geoCoder = nodeGeocoder(options);

        let fulladdress = data.state;
        fulladdress += ', ';
        fulladdress += data.country;
        fulladdress += ', ';
        fulladdress += data.pin;

        geoCoder.geocode(fulladdress).then((res)=> {
            let row = res[0];
            const jsonData = JSON.stringify(row)
            const removebracket1 = jsonData.replace('[','')
            const removebracket2 = removebracket1.replace(']','')
            const jsonParseobj = JSON.parse(removebracket2)
            const platitude = jsonParseobj.latitude
            const plongitude = jsonParseobj.longitude
            const pcountry = jsonParseobj.country
            const pstate = jsonParseobj.state
            const ppin = jsonParseobj.zipcode

            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                if(pcountry === data.country && pstate === data.state && ppin === data.pin)  {
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".ITEM_INFO(GIVER_ACCOUNT, ITEM_CATEGORY, ITEM_SUBCATEGORY, ITEM_NAME, GIVER_COUNTRY, GIVER_STATE, GIVER_CITY, GIVER_PIN_OR_ZIP, GIVER_ADDRESS, GIVER_PHONE_NO, GIVER_LATITUDE, GIVER_LONGITUDE) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [data.account, data.category, data.subcategory, data.itemname, data.country, data.state, data.city, data.pin, data.address, data.phone, platitude, plongitude], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Successfully Created a new pickup request(Without File)");
                })
                } else {
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".ITEM_INFO(GIVER_ACCOUNT, ITEM_CATEGORY, ITEM_SUBCATEGORY, ITEM_NAME, GIVER_COUNTRY, GIVER_STATE, GIVER_CITY, GIVER_PIN_OR_ZIP, GIVER_ADDRESS, GIVER_PHONE_NO) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [data.account, data.category, data.subcategory, data.itemname, data.country, data.state, data.city, data.pin, data.address, data.phone], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Successfully Created a new pickup request(Without File)");
                })
                }
            });
        })
        .catch((err)=> {
            console.log(err);
        });
    });
};

let getPickupRequestNumber = (account) => {
    console.log('profileService: getPickupRequestNumber')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".ITEM_INFO WHERE giver_account=? ORDER BY ITEM_NO DESC fetch first 1 row only with ur;", [account], function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let data = rows;
                    resolve(data);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let extractPickupRequest = (account) => {
    console.log('profileService: extractPickupRequest')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                let count = process.env.FETCH_ROW_COUNT;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".ITEM_INFO WHERE giver_account=? ORDER BY LAST_UPDATED_TS DESC fetch first ? rows only with ur;", [account, count], function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    let data = rows;
                    resolve(data);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let getGivingHistoryForEditPage = (itemno) => {
    console.log('profileService: getGivingHistoryForEditPage')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".item_info WHERE item_no=? with ur;", [itemno], function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    let pickup = rows;
                    resolve(pickup);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let updatePickupInfoWithFile = (data, cloudinary_public_id, cloudinary_secure_url) => {
    console.log('profileService: updatePickupInfoWithFile')
    return new Promise(async (resolve, reject) => {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("UPDATE "+process.env.DB_SCHEMA+".item_info SET GIVER_ACCOUNT = ?, ITEM_CATEGORY = ?, ITEM_SUBCATEGORY= ?, ITEM_NAME= ?, GIVER_COUNTRY= ?, GIVER_STATE= ?, GIVER_CITY= ?, GIVER_PIN_OR_ZIP= ?, GIVER_ADDRESS= ?, GIVER_PHONE_NO= ?, IMAGE_CLOUDINARY_PUBLIC_ID = ?, IMAGE_CLOUDINARY_SECURE_URL = ? where item_no = ?;", [data.account, data.category, data.subcategory, data.itemname, data.country, data.state, data.city, data.pin, data.address, data.phone, cloudinary_public_id, cloudinary_secure_url, data.itemno], function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(false)
                    }
                    resolve("Successfully updated pickup request(With File)");
                })
            });
    });
};

let updatePickupInfoWithoutFile = (data) => {
    console.log('pickuprequestService: updatePickupInfoWithoutFile')
    return new Promise(async (resolve, reject) => {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("UPDATE "+process.env.DB_SCHEMA+".item_info SET GIVER_ACCOUNT = ?, ITEM_CATEGORY = ?, ITEM_SUBCATEGORY= ?, ITEM_NAME= ?, GIVER_COUNTRY= ?, GIVER_STATE= ?, GIVER_CITY= ?, GIVER_PIN_OR_ZIP= ?, GIVER_ADDRESS= ?, GIVER_PHONE_NO= ? where item_no = ?;", [data.account, data.category, data.subcategory, data.itemname, data.country, data.state, data.city, data.pin, data.address, data.phone, data.itemno], function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(false)
                    }
                    resolve("Successfully updated pickup request(Without File)");
                })
            });
    });
};


const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

let deletePhysicalFile = (itemno) => {
    console.log('profileService: deletePhysicalFile')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".item_info where item_no=? with ur;", [itemno], function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    else {
                    let pickupinfo = rows;
                    const jsonData = JSON.stringify(pickupinfo)
                    const removebracket1 = jsonData.replace('[','')
                    const removebracket2 = removebracket1.replace(']','')
                    const jsonParseobj = JSON.parse(removebracket2)
                    const public_id = jsonParseobj.IMAGE_CLOUDINARY_PUBLIC_ID
                    if (public_id > '') {
                        cloudinary.uploader.destroy(public_id, function(result) { console.log('File is removed from Cloudinary') });

                    }
                    resolve();
                    }
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let deletePickupById = (id) => {
    console.log('profileService: deletePickupById')
    return new Promise(async (resolve, reject) => {
        ibmdb.open(connStr, function (err, conn) {
            if (err) throw err;
            conn.query("DELETE FROM "+process.env.DB_SCHEMA+".item_info where item_no=?;", [id], function(err, rows) {
                if (err) {
                    console.log(err)
                    reject(false)
                }
                resolve("Successfully deleted pickup request");
            })
        });
    });
};

module.exports = {
    createPickupRequestWithFile: createPickupRequestWithFile,
    createPickupRequestWithoutFile: createPickupRequestWithoutFile,
    getPickupRequestNumber: getPickupRequestNumber,
    extractPickupRequest: extractPickupRequest,
    getGivingHistoryForEditPage: getGivingHistoryForEditPage,
    deletePhysicalFile: deletePhysicalFile,
    updatePickupInfoWithFile: updatePickupInfoWithFile,
    updatePickupInfoWithoutFile: updatePickupInfoWithoutFile,
    deletePickupById: deletePickupById
};