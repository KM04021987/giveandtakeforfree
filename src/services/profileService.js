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
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".ITEM_INFO(GIVER_ACCOUNT, ITEM_CATEGORY, ITEM_SUBCATEGORY, ITEM_NAME, GIVER_COUNTRY, GIVER_STATE, GIVER_CITY, GIVER_PIN_OR_ZIP, GIVER_ADDRESS, GIVER_PHONE_NO_DISPLAY, GIVER_PHONE_NO, IMAGE_CLOUDINARY_PUBLIC_ID, IMAGE_CLOUDINARY_SECURE_URL, GIVER_LATITUDE, GIVER_LONGITUDE) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [data.account, data.category, data.subcategory, data.itemname, data.country, data.state, data.city, data.pin, data.address, data.giver_phone_no_display, data.phone, cloudinary_public_id, cloudinary_secure_url, platitude, plongitude], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Successfully Created a new pickup request(With File)");
                })
                } else {
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".ITEM_INFO(GIVER_ACCOUNT, ITEM_CATEGORY, ITEM_SUBCATEGORY, ITEM_NAME, GIVER_COUNTRY, GIVER_STATE, GIVER_CITY, GIVER_PHONE_NO_DISPLAY, GIVER_PIN_OR_ZIP, GIVER_ADDRESS, GIVER_PHONE_NO, IMAGE_CLOUDINARY_PUBLIC_ID, IMAGE_CLOUDINARY_SECURE_URL) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [data.account, data.category, data.subcategory, data.itemname, data.country, data.state, data.city, data.pin, data.address, data.giver_phone_no_display, data.phone, cloudinary_public_id, cloudinary_secure_url], function(err, rows) {
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
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".ITEM_INFO(GIVER_ACCOUNT, ITEM_CATEGORY, ITEM_SUBCATEGORY, ITEM_NAME, GIVER_COUNTRY, GIVER_STATE, GIVER_CITY, GIVER_PIN_OR_ZIP, GIVER_ADDRESS, GIVER_PHONE_NO_DISPLAY, GIVER_PHONE_NO, GIVER_LATITUDE, GIVER_LONGITUDE) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [data.account, data.category, data.subcategory, data.itemname, data.country, data.state, data.city, data.pin, data.address, data.giver_phone_no_display, data.phone, platitude, plongitude], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Successfully Created a new pickup request(Without File)");
                })
                } else {
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".ITEM_INFO(GIVER_ACCOUNT, ITEM_CATEGORY, ITEM_SUBCATEGORY, ITEM_NAME, GIVER_COUNTRY, GIVER_STATE, GIVER_CITY, GIVER_PIN_OR_ZIP, GIVER_ADDRESS, GIVER_PHONE_NO_DISPLAY, GIVER_PHONE_NO) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [data.account, data.category, data.subcategory, data.itemname, data.country, data.state, data.city, data.pin, data.address, data.giver_phone_no_display, data.phone], function(err, rows) {
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
                conn.query("select * from(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                \
                                select A.ITEM_NO, A.GIVER_ACCOUNT,  A.ITEM_CATEGORY, A.ITEM_SUBCATEGORY, A.ITEM_NAME, A.GIVER_COUNTRY, A.GIVER_STATE, A.GIVER_CITY, A.GIVER_PIN_OR_ZIP, A.GIVER_ADDRESS, A.GIVER_PHONE_NO_DISPLAY, A.GIVER_PHONE_NO, A.IMAGE_CLOUDINARY_PUBLIC_ID, A.IMAGE_CLOUDINARY_SECURE_URL, A.GIVER_LATITUDE, A.GIVER_LONGITUDE, A.TAKER_ACCOUNT1, A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO, A.TAKER_ACCOUNT2, A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO,A.TAKER_ACCOUNT3,	A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO, A.ITEM_STATUS, A.ADD_TS, A.LAST_UPDATED_TS, A.TAKER_ACCOUNT1_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT2_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT3_RESPONSE_TO_PHONE_NO,  \
                                B.FULLNAME as TAKER_ACCOUNT1_FULLNAME, B.PHONE_NO as TAKER_ACCOUNT1_PHONE_NO, B.COUNTRY as TAKER_ACCOUNT1_COUNTRY, B.STATE as TAKER_ACCOUNT1_STATE, B.CITY as TAKER_ACCOUNT1_CITY, B.PIN_OR_ZIP as TAKER_ACCOUNT1_PIN_OR_ZIP, B.ADDRESS as TAKER_ACCOUNT1_ADDRESS,                                                                                                                                                                                                                                                                        \
                                C.FULLNAME as TAKER_ACCOUNT2_FULLNAME, C.PHONE_NO as TAKER_ACCOUNT2_PHONE_NO, C.COUNTRY as TAKER_ACCOUNT2_COUNTRY, C.STATE as TAKER_ACCOUNT2_STATE, C.CITY as TAKER_ACCOUNT2_CITY, C.PIN_OR_ZIP as TAKER_ACCOUNT2_PIN_OR_ZIP, C.ADDRESS as TAKER_ACCOUNT2_ADDRESS,                                                                                                                                                                                                                                                                        \
                                D.FULLNAME as TAKER_ACCOUNT3_FULLNAME, D.PHONE_NO as TAKER_ACCOUNT3_PHONE_NO, D.COUNTRY as TAKER_ACCOUNT3_COUNTRY, D.STATE as TAKER_ACCOUNT3_STATE, D.CITY as TAKER_ACCOUNT3_CITY, D.PIN_OR_ZIP as TAKER_ACCOUNT3_PIN_OR_ZIP, D.ADDRESS as TAKER_ACCOUNT3_ADDRESS                                                                                                                                                                                                                                                                         \
                                from "+process.env.DB_SCHEMA+".ITEM_INFO A, "+process.env.DB_SCHEMA+".USER_INFO B, "+process.env.DB_SCHEMA+".USER_INFO C, "+process.env.DB_SCHEMA+".USER_INFO D                                                                                                                                                                                                                                                                                                                                                                           \
                                where A.GIVER_ACCOUNT = ?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                                and  A.TAKER_ACCOUNT1 =  (CASE A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO WHEN 'Y' THEN B.ACCOUNT END)                                                                                                                                                                                                                                                                                                                                                                                                                                           \
                                and A.TAKER_ACCOUNT2 =  (CASE A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO WHEN 'Y' THEN C.ACCOUNT END)                                                                                                                                                                                                                                                                                                                                                                                                                                            \
                                and A.TAKER_ACCOUNT3 =  (CASE A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO WHEN 'Y' THEN D.ACCOUNT END)                                                                                                                                                                                                                                                                                                                                                                                                                                            \
                                union all                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          \
                                select A.ITEM_NO, A.GIVER_ACCOUNT,  A.ITEM_CATEGORY, A.ITEM_SUBCATEGORY, A.ITEM_NAME, A.GIVER_COUNTRY, A.GIVER_STATE, A.GIVER_CITY, A.GIVER_PIN_OR_ZIP, A.GIVER_ADDRESS, A.GIVER_PHONE_NO_DISPLAY, A.GIVER_PHONE_NO, A.IMAGE_CLOUDINARY_PUBLIC_ID, A.IMAGE_CLOUDINARY_SECURE_URL, A.GIVER_LATITUDE, A.GIVER_LONGITUDE, A.TAKER_ACCOUNT1, A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO, A.TAKER_ACCOUNT2, A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO,A.TAKER_ACCOUNT3,	A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO, A.ITEM_STATUS, A.ADD_TS, A.LAST_UPDATED_TS, A.TAKER_ACCOUNT1_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT2_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT3_RESPONSE_TO_PHONE_NO,  \
                                B.FULLNAME as TAKER_ACCOUNT1_FULLNAME, B.PHONE_NO as TAKER_ACCOUNT1_PHONE_NO, B.COUNTRY as TAKER_ACCOUNT1_COUNTRY, B.STATE as TAKER_ACCOUNT1_STATE, B.CITY as TAKER_ACCOUNT1_CITY, B.PIN_OR_ZIP as TAKER_ACCOUNT1_PIN_OR_ZIP, B.ADDRESS as TAKER_ACCOUNT1_ADDRESS,                                                                                                                                                                                                                                                                        \
                                ' ' as TAKER_ACCOUNT2_FULLNAME, ' ' as TAKER_ACCOUNT2_PHONE_NO, ' ' as TAKER_ACCOUNT2_COUNTRY, ' ' as TAKER_ACCOUNT2_STATE, ' ' as TAKER_ACCOUNT2_CITY, ' ' as TAKER_ACCOUNT2_PIN_OR_ZIP, ' ' as TAKER_ACCOUNT2_ADDRESS,                                                                                                                                                                                                                                                                                                                  \
                                ' ' as TAKER_ACCOUNT3_FULLNAME, ' ' as TAKER_ACCOUNT3_PHONE_NO, ' ' as TAKER_ACCOUNT3_COUNTRY, ' ' as TAKER_ACCOUNT3_STATE, ' ' as TAKER_ACCOUNT3_CITY, ' ' as TAKER_ACCOUNT3_PIN_OR_ZIP, ' ' as TAKER_ACCOUNT3_ADDRESS                                                                                                                                                                                                                                                                                                                   \
                                from "+process.env.DB_SCHEMA+".ITEM_INFO A, "+process.env.DB_SCHEMA+".USER_INFO B                                                                                                                                                                                                                                                                                                                                                                                                                                                         \
                                where A.GIVER_ACCOUNT = ?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                                and A.TAKER_ACCOUNT1 =  (CASE A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO WHEN 'Y' THEN B.ACCOUNT END)                                                                                                                                                                                                                                                                                                                                                                                                                                            \
                                and A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO = 'N'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             \
                                and A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO = 'N'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             \
                                union all                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          \
                                select A.ITEM_NO, A.GIVER_ACCOUNT,  A.ITEM_CATEGORY, A.ITEM_SUBCATEGORY, A.ITEM_NAME, A.GIVER_COUNTRY, A.GIVER_STATE, A.GIVER_CITY, A.GIVER_PIN_OR_ZIP, A.GIVER_ADDRESS, A.GIVER_PHONE_NO_DISPLAY, A.GIVER_PHONE_NO, A.IMAGE_CLOUDINARY_PUBLIC_ID, A.IMAGE_CLOUDINARY_SECURE_URL, A.GIVER_LATITUDE, A.GIVER_LONGITUDE, A.TAKER_ACCOUNT1, A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO, A.TAKER_ACCOUNT2, A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO,A.TAKER_ACCOUNT3,	A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO, A.ITEM_STATUS, A.ADD_TS, A.LAST_UPDATED_TS, A.TAKER_ACCOUNT1_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT2_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT3_RESPONSE_TO_PHONE_NO,  \
                                ' ' as TAKER_ACCOUNT1_FULLNAME, ' ' as TAKER_ACCOUNT1_PHONE_NO, ' ' as TAKER_ACCOUNT1_COUNTRY, ' ' as TAKER_ACCOUNT1_STATE, ' ' as TAKER_ACCOUNT1_CITY, ' ' as TAKER_ACCOUNT1_PIN_OR_ZIP, ' ' as TAKER_ACCOUNT1_ADDRESS,                                                                                                                                                                                                                                                                                                                  \
                                C.FULLNAME as TAKER_ACCOUNT2_FULLNAME, C.PHONE_NO as TAKER_ACCOUNT2_PHONE_NO, C.COUNTRY as TAKER_ACCOUNT2_COUNTRY, C.STATE as TAKER_ACCOUNT2_STATE, C.CITY as TAKER_ACCOUNT2_CITY, C.PIN_OR_ZIP as TAKER_ACCOUNT2_PIN_OR_ZIP, C.ADDRESS as TAKER_ACCOUNT2_ADDRESS,                                                                                                                                                                                                                                                                        \
                                ' ' as TAKER_ACCOUNT3_FULLNAME, ' ' as TAKER_ACCOUNT3_PHONE_NO, ' ' as TAKER_ACCOUNT3_COUNTRY, ' ' as TAKER_ACCOUNT3_STATE, ' ' as TAKER_ACCOUNT3_CITY, ' ' as TAKER_ACCOUNT3_PIN_OR_ZIP, ' ' as TAKER_ACCOUNT3_ADDRESS                                                                                                                                                                                                                                                                                                                   \
                                from "+process.env.DB_SCHEMA+".ITEM_INFO A, "+process.env.DB_SCHEMA+".USER_INFO C                                                                                                                                                                                                                                                                                                                                                                                                                                                         \
                                where A.GIVER_ACCOUNT = ?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                                and A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO = 'N'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             \
                                and A.TAKER_ACCOUNT2 =  (CASE A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO WHEN 'Y' THEN C.ACCOUNT END)                                                                                                                                                                                                                                                                                                                                                                                                                                            \
                                and A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO = 'N'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             \
                                union all                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          \
                                select A.ITEM_NO, A.GIVER_ACCOUNT,  A.ITEM_CATEGORY, A.ITEM_SUBCATEGORY, A.ITEM_NAME, A.GIVER_COUNTRY, A.GIVER_STATE, A.GIVER_CITY, A.GIVER_PIN_OR_ZIP, A.GIVER_ADDRESS, A.GIVER_PHONE_NO_DISPLAY, A.GIVER_PHONE_NO, A.IMAGE_CLOUDINARY_PUBLIC_ID, A.IMAGE_CLOUDINARY_SECURE_URL, A.GIVER_LATITUDE, A.GIVER_LONGITUDE, A.TAKER_ACCOUNT1, A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO, A.TAKER_ACCOUNT2, A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO,A.TAKER_ACCOUNT3,	A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO, A.ITEM_STATUS, A.ADD_TS, A.LAST_UPDATED_TS, A.TAKER_ACCOUNT1_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT2_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT3_RESPONSE_TO_PHONE_NO,  \
                                ' ' as TAKER_ACCOUNT1_FULLNAME, ' ' as TAKER_ACCOUNT1_PHONE_NO, ' ' as TAKER_ACCOUNT1_COUNTRY, ' ' as TAKER_ACCOUNT1_STATE, ' ' as TAKER_ACCOUNT1_CITY, ' ' as TAKER_ACCOUNT1_PIN_OR_ZIP, ' ' as TAKER_ACCOUNT1_ADDRESS,                                                                                                                                                                                                                                                                                                                  \
                                ' ' as TAKER_ACCOUNT2_FULLNAME, ' ' as TAKER_ACCOUNT2_PHONE_NO, ' ' as TAKER_ACCOUNT2_COUNTRY, ' ' as TAKER_ACCOUNT2_STATE, ' ' as TAKER_ACCOUNT2_CITY, ' ' as TAKER_ACCOUNT2_PIN_OR_ZIP, ' ' as TAKER_ACCOUNT2_ADDRESS,                                                                                                                                                                                                                                                                                                                  \
                                D.FULLNAME as TAKER_ACCOUNT3_FULLNAME, D.PHONE_NO as TAKER_ACCOUNT3_PHONE_NO, D.COUNTRY as TAKER_ACCOUNT3_COUNTRY, D.STATE as TAKER_ACCOUNT3_STATE, D.CITY as TAKER_ACCOUNT3_CITY, D.PIN_OR_ZIP as TAKER_ACCOUNT3_PIN_OR_ZIP, D.ADDRESS as TAKER_ACCOUNT3_ADDRESS                                                                                                                                                                                                                                                                         \
                                from "+process.env.DB_SCHEMA+".ITEM_INFO A, "+process.env.DB_SCHEMA+".USER_INFO D                                                                                                                                                                                                                                                                                                                                                                                                                                                         \
                                where A.GIVER_ACCOUNT = ?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                                and A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO = 'N'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             \
                                and A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO = 'N'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             \
                                and A.TAKER_ACCOUNT3 =  (CASE A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO WHEN 'Y' THEN D.ACCOUNT END)                                                                                                                                                                                                                                                                                                                                                                                                                                            \
                                union all                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          \
                                select A.ITEM_NO, A.GIVER_ACCOUNT,  A.ITEM_CATEGORY, A.ITEM_SUBCATEGORY, A.ITEM_NAME, A.GIVER_COUNTRY, A.GIVER_STATE, A.GIVER_CITY, A.GIVER_PIN_OR_ZIP, A.GIVER_ADDRESS, A.GIVER_PHONE_NO_DISPLAY, A.GIVER_PHONE_NO, A.IMAGE_CLOUDINARY_PUBLIC_ID, A.IMAGE_CLOUDINARY_SECURE_URL, A.GIVER_LATITUDE, A.GIVER_LONGITUDE, A.TAKER_ACCOUNT1, A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO, A.TAKER_ACCOUNT2, A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO,A.TAKER_ACCOUNT3,	A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO, A.ITEM_STATUS, A.ADD_TS, A.LAST_UPDATED_TS, A.TAKER_ACCOUNT1_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT2_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT3_RESPONSE_TO_PHONE_NO,  \
                                B.FULLNAME as TAKER_ACCOUNT1_FULLNAME, B.PHONE_NO as TAKER_ACCOUNT1_PHONE_NO, B.COUNTRY as TAKER_ACCOUNT1_COUNTRY, B.STATE as TAKER_ACCOUNT1_STATE, B.CITY as TAKER_ACCOUNT1_CITY, B.PIN_OR_ZIP as TAKER_ACCOUNT1_PIN_OR_ZIP, B.ADDRESS as TAKER_ACCOUNT1_ADDRESS,                                                                                                                                                                                                                                                                        \
                                C.FULLNAME as TAKER_ACCOUNT2_FULLNAME, C.PHONE_NO as TAKER_ACCOUNT2_PHONE_NO, C.COUNTRY as TAKER_ACCOUNT2_COUNTRY, C.STATE as TAKER_ACCOUNT2_STATE, C.CITY as TAKER_ACCOUNT2_CITY, C.PIN_OR_ZIP as TAKER_ACCOUNT2_PIN_OR_ZIP, C.ADDRESS as TAKER_ACCOUNT2_ADDRESS,                                                                                                                                                                                                                                                                        \
                                ' ' as TAKER_ACCOUNT3_FULLNAME, ' ' as TAKER_ACCOUNT3_PHONE_NO, ' ' as TAKER_ACCOUNT3_COUNTRY, ' ' as TAKER_ACCOUNT3_STATE, ' ' as TAKER_ACCOUNT3_CITY, ' ' as TAKER_ACCOUNT3_PIN_OR_ZIP, ' ' as TAKER_ACCOUNT3_ADDRESS                                                                                                                                                                                                                                                                                                                   \
                                from "+process.env.DB_SCHEMA+".ITEM_INFO A, "+process.env.DB_SCHEMA+".USER_INFO B, "+process.env.DB_SCHEMA+".USER_INFO C                                                                                                                                                                                                                                                                                                                                                                                                                  \
                                where A.GIVER_ACCOUNT = ?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                                and A.TAKER_ACCOUNT1 =  (CASE A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO WHEN 'Y' THEN B.ACCOUNT END)                                                                                                                                                                                                                                                                                                                                                                                                                                            \
                                and A.TAKER_ACCOUNT2 =  (CASE A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO WHEN 'Y' THEN C.ACCOUNT END)                                                                                                                                                                                                                                                                                                                                                                                                                                            \
                                and A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO = 'N'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             \
                                union all                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          \
                                select A.ITEM_NO, A.GIVER_ACCOUNT,  A.ITEM_CATEGORY, A.ITEM_SUBCATEGORY, A.ITEM_NAME, A.GIVER_COUNTRY, A.GIVER_STATE, A.GIVER_CITY, A.GIVER_PIN_OR_ZIP, A.GIVER_ADDRESS, A.GIVER_PHONE_NO_DISPLAY, A.GIVER_PHONE_NO, A.IMAGE_CLOUDINARY_PUBLIC_ID, A.IMAGE_CLOUDINARY_SECURE_URL, A.GIVER_LATITUDE, A.GIVER_LONGITUDE, A.TAKER_ACCOUNT1, A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO, A.TAKER_ACCOUNT2, A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO,A.TAKER_ACCOUNT3,	A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO, A.ITEM_STATUS, A.ADD_TS, A.LAST_UPDATED_TS, A.TAKER_ACCOUNT1_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT2_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT3_RESPONSE_TO_PHONE_NO,  \
                                B.FULLNAME as TAKER_ACCOUNT1_FULLNAME, B.PHONE_NO as TAKER_ACCOUNT1_PHONE_NO, B.COUNTRY as TAKER_ACCOUNT1_COUNTRY, B.STATE as TAKER_ACCOUNT1_STATE, B.CITY as TAKER_ACCOUNT1_CITY, B.PIN_OR_ZIP as TAKER_ACCOUNT1_PIN_OR_ZIP, B.ADDRESS as TAKER_ACCOUNT1_ADDRESS,                                                                                                                                                                                                                                                                        \
                                ' ' as TAKER_ACCOUNT2_FULLNAME, ' ' as TAKER_ACCOUNT2_PHONE_NO, ' ' as TAKER_ACCOUNT2_COUNTRY, ' ' as TAKER_ACCOUNT2_STATE, ' ' as TAKER_ACCOUNT2_CITY, ' ' as TAKER_ACCOUNT2_PIN_OR_ZIP, ' ' as TAKER_ACCOUNT2_ADDRESS,                                                                                                                                                                                                                                                                                                                  \
                                D.FULLNAME as TAKER_ACCOUNT3_FULLNAME, D.PHONE_NO as TAKER_ACCOUNT3_PHONE_NO, D.COUNTRY as TAKER_ACCOUNT3_COUNTRY, D.STATE as TAKER_ACCOUNT3_STATE, D.CITY as TAKER_ACCOUNT3_CITY, D.PIN_OR_ZIP as TAKER_ACCOUNT3_PIN_OR_ZIP, D.ADDRESS as TAKER_ACCOUNT3_ADDRESS                                                                                                                                                                                                                                                                         \
                                from "+process.env.DB_SCHEMA+".ITEM_INFO A, "+process.env.DB_SCHEMA+".USER_INFO B, "+process.env.DB_SCHEMA+".USER_INFO D                                                                                                                                                                                                                                                                                                                                                                                                                  \
                                where A.GIVER_ACCOUNT = ?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                                and A.TAKER_ACCOUNT1 =  (CASE A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO WHEN 'Y' THEN B.ACCOUNT END)                                                                                                                                                                                                                                                                                                                                                                                                                                            \
                                and A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO = 'N'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             \
                                and A.TAKER_ACCOUNT3 =  (CASE A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO WHEN 'Y' THEN D.ACCOUNT END)                                                                                                                                                                                                                                                                                                                                                                                                                                            \
                                union all                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          \
                                select A.ITEM_NO, A.GIVER_ACCOUNT,  A.ITEM_CATEGORY, A.ITEM_SUBCATEGORY, A.ITEM_NAME, A.GIVER_COUNTRY, A.GIVER_STATE, A.GIVER_CITY, A.GIVER_PIN_OR_ZIP, A.GIVER_ADDRESS, A.GIVER_PHONE_NO_DISPLAY, A.GIVER_PHONE_NO, A.IMAGE_CLOUDINARY_PUBLIC_ID, A.IMAGE_CLOUDINARY_SECURE_URL, A.GIVER_LATITUDE, A.GIVER_LONGITUDE, A.TAKER_ACCOUNT1, A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO, A.TAKER_ACCOUNT2, A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO,A.TAKER_ACCOUNT3,	A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO, A.ITEM_STATUS, A.ADD_TS, A.LAST_UPDATED_TS, A.TAKER_ACCOUNT1_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT2_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT3_RESPONSE_TO_PHONE_NO, \
                                ' ' as TAKER_ACCOUNT1_FULLNAME, ' ' as TAKER_ACCOUNT1_PHONE_NO, ' ' as TAKER_ACCOUNT1_COUNTRY, ' ' as TAKER_ACCOUNT1_STATE, ' ' as TAKER_ACCOUNT1_CITY, ' ' as TAKER_ACCOUNT1_PIN_OR_ZIP, ' ' as TAKER_ACCOUNT1_ADDRESS,                                                                                                                                                                                                                                                                                                                  \
                                C.FULLNAME as TAKER_ACCOUNT2_FULLNAME, C.PHONE_NO as TAKER_ACCOUNT2_PHONE_NO, C.COUNTRY as TAKER_ACCOUNT2_COUNTRY, C.STATE as TAKER_ACCOUNT2_STATE, C.CITY as TAKER_ACCOUNT2_CITY, C.PIN_OR_ZIP as TAKER_ACCOUNT2_PIN_OR_ZIP, C.ADDRESS as TAKER_ACCOUNT2_ADDRESS,                                                                                                                                                                                                                                                                        \
                                D.FULLNAME as TAKER_ACCOUNT3_FULLNAME, D.PHONE_NO as TAKER_ACCOUNT3_PHONE_NO, D.COUNTRY as TAKER_ACCOUNT3_COUNTRY, D.STATE as TAKER_ACCOUNT3_STATE, D.CITY as TAKER_ACCOUNT3_CITY, D.PIN_OR_ZIP as TAKER_ACCOUNT3_PIN_OR_ZIP, D.ADDRESS as TAKER_ACCOUNT3_ADDRESS                                                                                                                                                                                                                                                                         \
                                from "+process.env.DB_SCHEMA+".ITEM_INFO A, "+process.env.DB_SCHEMA+".USER_INFO C, "+process.env.DB_SCHEMA+".USER_INFO D                                                                                                                                                                                                                                                                                                                                                                                                                  \
                                where A.GIVER_ACCOUNT = ?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                                and A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO = 'N'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             \
                                and A.TAKER_ACCOUNT2 =  (CASE A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO WHEN 'Y' THEN C.ACCOUNT END)                                                                                                                                                                                                                                                                                                                                                                                                                                            \
                                and A.TAKER_ACCOUNT3 =  (CASE A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO WHEN 'Y' THEN D.ACCOUNT END)                                                                                                                                                                                                                                                                                                                                                                                                                                            \
                                union all                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          \
                                select A.ITEM_NO, A.GIVER_ACCOUNT,  A.ITEM_CATEGORY, A.ITEM_SUBCATEGORY, A.ITEM_NAME, A.GIVER_COUNTRY, A.GIVER_STATE, A.GIVER_CITY, A.GIVER_PIN_OR_ZIP, A.GIVER_ADDRESS, A.GIVER_PHONE_NO_DISPLAY, A.GIVER_PHONE_NO, A.IMAGE_CLOUDINARY_PUBLIC_ID, A.IMAGE_CLOUDINARY_SECURE_URL, A.GIVER_LATITUDE, A.GIVER_LONGITUDE, A.TAKER_ACCOUNT1, A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO, A.TAKER_ACCOUNT2, A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO,A.TAKER_ACCOUNT3,	A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO, A.ITEM_STATUS, A.ADD_TS, A.LAST_UPDATED_TS, A.TAKER_ACCOUNT1_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT2_RESPONSE_TO_PHONE_NO, A.TAKER_ACCOUNT3_RESPONSE_TO_PHONE_NO,  \
                                ' ' as TAKER_ACCOUNT1_FULLNAME, ' ' as TAKER_ACCOUNT1_PHONE_NO, ' ' as TAKER_ACCOUNT1_COUNTRY, ' ' as TAKER_ACCOUNT1_STATE, ' ' as TAKER_ACCOUNT1_CITY, ' ' as TAKER_ACCOUNT1_PIN_OR_ZIP, ' ' as TAKER_ACCOUNT1_ADDRESS,                                                                                                                                                                                                                                                                                                                  \
                                ' ' as TAKER_ACCOUNT2_FULLNAME, ' ' as TAKER_ACCOUNT2_PHONE_NO, ' ' as TAKER_ACCOUNT2_COUNTRY, ' ' as TAKER_ACCOUNT2_STATE, ' ' as TAKER_ACCOUNT2_CITY, ' ' as TAKER_ACCOUNT2_PIN_OR_ZIP, ' ' as TAKER_ACCOUNT2_ADDRESS,                                                                                                                                                                                                                                                                                                                  \
                                ' ' as TAKER_ACCOUNT3_FULLNAME, ' ' as TAKER_ACCOUNT3_PHONE_NO, ' ' as TAKER_ACCOUNT3_COUNTRY, ' ' as TAKER_ACCOUNT3_STATE, ' ' as TAKER_ACCOUNT3_CITY, ' ' as TAKER_ACCOUNT3_PIN_OR_ZIP, ' ' as TAKER_ACCOUNT3_ADDRESS                                                                                                                                                                                                                                                                                                                   \
                                from "+process.env.DB_SCHEMA+".ITEM_INFO A                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                \
                                where A.GIVER_ACCOUNT = ?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                                and A.TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO = 'N'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             \
                                and A.TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO = 'N'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             \
                                and A.TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO = 'N') dummy                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      \
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          \
                            order by LAST_UPDATED_TS DESC                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
                            fetch first ? rows only                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       \
                            with ur;", [account, account, account, account, account, account, account, account, count], function(err, rows) {
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

let getGiversList = (findByInfo) => {
    console.log('profileService: getGiversList')
    return new Promise((resolve, reject) => {
        try {
            let options = {
                provider: 'openstreetmap'
            };
            let geoCoder = nodeGeocoder(options);

            let fulladdress = findByInfo.state;
            fulladdress += ', ';
            fulladdress += findByInfo.country;
            fulladdress += ', ';
            fulladdress += findByInfo.pin;

            geoCoder.geocode(fulladdress).then((res)=> {
                let row = res[0];
                const jsonData = JSON.stringify(row)
                const removebracket1 = jsonData.replace('[','')
                const removebracket2 = removebracket1.replace(']','')
                const jsonParseobj = JSON.parse(removebracket2)
                const flatitude = jsonParseobj.latitude
                const flongitude = jsonParseobj.longitude

                let latrange = process.env.LATITUDE_RANGE;
                let lonrange = process.env.LONGITUDE_RANGE;
                let minlat = flatitude - latrange
                let maxlat = (+flatitude) + (+latrange)
                let minlon = flongitude - lonrange
                let maxlon = (+flongitude) + (+lonrange)

            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                let count = process.env.FETCH_ROW_COUNT;
                if(findByInfo.category == 'Any') {
                    if(flatitude != null && flongitude != null)  { 
                    conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".item_info WHERE (giver_latitude >= ? and giver_latitude <= ?) and (giver_longitude >= ? and giver_longitude <= ?) and GIVER_ACCOUNT <> ? and (TAKER_ACCOUNT1 = ? or TAKER_ACCOUNT2 = ? or TAKER_ACCOUNT3 = ? or TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO = 'N' or TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO = 'N' or TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO = 'N') ORDER BY LAST_UPDATED_TS DESC fetch first ? rows only with ur;", [minlat, maxlat, minlon, maxlon, findByInfo.account, findByInfo.account, findByInfo.account, findByInfo.account, count], function(err, rows) {
                        if (err) {
                            console.log(err)
                            reject(err)
                        }
                        let data = rows;
                        resolve(data);
                    })
                    } else {
                    conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".item_info WHERE Country = ? and state = ? and PIN_OR_ZIP = ?  and GIVER_ACCOUNT <> ? and (TAKER_ACCOUNT1 = ? or TAKER_ACCOUNT2 = ? or TAKER_ACCOUNT3 = ? or TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO = 'N' or TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO = 'N' or TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO = 'N') ORDER BY LAST_UPDATED_TS DESC fetch first ? rows only with ur;", [findByInfo.country, findByInfo.state, findByInfo.pin, findByInfo.account, findByInfo.account, findByInfo.account, findByInfo.account, count], function(err, rows) {
                        if (err) {
                            console.log(err)
                            reject(err)
                        }
                        let data = rows;
                        resolve(data);
                    })
                    }
                } else {
                    if(flatitude != null && flongitude != null)  { 
                        conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".item_info WHERE (giver_latitude >= ? and giver_latitude <= ?) and (giver_longitude >= ? and giver_longitude <= ?)  and item_category = ? and item_subcategory = ? and GIVER_ACCOUNT <> ? and (TAKER_ACCOUNT1 = ? or TAKER_ACCOUNT2 = ? or TAKER_ACCOUNT3 = ? or TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO = 'N' or TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO = 'N' or TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO = 'N') ORDER BY LAST_UPDATED_TS DESC fetch first ? rows only with ur;", [minlat, maxlat, minlon, maxlon, findByInfo.category, findByInfo.subcategory, findByInfo.account, findByInfo.account, findByInfo.account, findByInfo.account, count], function(err, rows) {
                            if (err) {
                                console.log(err)
                                reject(err)
                            }
                            let data = rows;
                            resolve(data);
                        })
                        } else {
                        conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".item_info WHERE Country = ? and state = ? and PIN_OR_ZIP = ?  and item_category = ? and item_subcategory = ? and GIVER_ACCOUNT <> ? and (TAKER_ACCOUNT1 = ? or TAKER_ACCOUNT2 = ? or TAKER_ACCOUNT3 = ? or TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO = 'N' or TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO = 'N' or TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO = 'N') ORDER BY LAST_UPDATED_TS DESC fetch first ? rows only with ur;", [findByInfo.country, findByInfo.state, findByInfo.pin, findByInfo.category, findByInfo.subcategory, findByInfo.account, findByInfo.account, findByInfo.account, findByInfo.account, count], function(err, rows) {
                            if (err) {
                                console.log(err)
                                reject(err)
                            }
                            let data = rows;
                            resolve(data);
                        })
                    }                    
                }
            });
        })
        .catch((err)=> {
            console.log(err);
        });
        } catch (err) {
            reject(err);
        }
    });
};

let requestContactNumber = (sendrequest) => {
    console.log('profileService: requestContactNumber')
    return new Promise(async (resolve, reject) => {
        ibmdb.open(connStr, function (err, conn) {
            if (err) throw err;
            conn.query("UPDATE "+process.env.DB_SCHEMA+".ITEM_INFO SET TAKER_ACCOUNT1 = case when COALESCE(TAKER_ACCOUNT1,999999) <> ? then COALESCE(TAKER_ACCOUNT1,?) end, TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO = case when TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO = 'N' then 'Y' else 'N' end WHERE ITEM_NO = ? and COALESCE(TAKER_ACCOUNT2,999999) <>  ? and COALESCE(TAKER_ACCOUNT3,999999) <>  ? and ((TAKER_ACCOUNT1 = ? AND TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO = 'Y') OR TAKER_ACCOUNT1 is null);",[sendrequest.giveraccount, sendrequest.giveraccount, sendrequest.itemno, sendrequest.giveraccount, sendrequest.giveraccount, sendrequest.giveraccount],  function(err, rows) {
                if (err) {
                    reject(err)
                } else {
                    ibmdb.open(connStr, function (err, conn) {
                        if (err) throw err;
                        conn.query("UPDATE "+process.env.DB_SCHEMA+".ITEM_INFO SET TAKER_ACCOUNT2 = case when COALESCE(TAKER_ACCOUNT2,999999) <> ? then COALESCE(TAKER_ACCOUNT2,?) end, TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO = case when TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO = 'N' then 'Y' else 'N' end WHERE ITEM_NO = ? and COALESCE(TAKER_ACCOUNT1,999999) <>  ? and COALESCE(TAKER_ACCOUNT3,999999) <>  ? and ((TAKER_ACCOUNT2 = ? AND TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO = 'Y') OR TAKER_ACCOUNT2 is null);",[sendrequest.giveraccount, sendrequest.giveraccount, sendrequest.itemno, sendrequest.giveraccount, sendrequest.giveraccount, sendrequest.giveraccount],  function(err, rows) {
                            if (err) {
                                reject(err)
                            } else {
                                ibmdb.open(connStr, function (err, conn) {
                                    if (err) throw err;
                                    conn.query("UPDATE "+process.env.DB_SCHEMA+".ITEM_INFO SET TAKER_ACCOUNT3 = case when COALESCE(TAKER_ACCOUNT3,999999) <> ? then COALESCE(TAKER_ACCOUNT3,?) end, TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO = case when TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO = 'N' then 'Y' else 'N' end WHERE ITEM_NO = ? and COALESCE(TAKER_ACCOUNT1,999999) <>  ? and COALESCE(TAKER_ACCOUNT2,999999) <>  ? and ((TAKER_ACCOUNT3 = ? AND TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO = 'Y') OR TAKER_ACCOUNT3 is null);",[sendrequest.giveraccount, sendrequest.giveraccount, sendrequest.itemno, sendrequest.giveraccount, sendrequest.giveraccount, sendrequest.giveraccount],  function(err, rows) {
                                        if (err) {
                                            reject(err)
                                        } else
                                        resolve("Request for contact number is successfully updated");
                                    })
                                });
                            } 
                        })
                    });
                } 
            })
        });
    });
}

let replyTakerAccount1 = (iteminfo) => {
    console.log('profileService: replyTakerAccount1')
    return new Promise(async (resolve, reject) => {
        ibmdb.open(connStr, function (err, conn) {
            if (err) throw err;
            if (iteminfo.acceptrejectinfo == 'Y') {
                conn.query("UPDATE "+process.env.DB_SCHEMA+".ITEM_INFO SET TAKER_ACCOUNT1_RESPONSE_TO_PHONE_NO = 'Y' WHERE ITEM_NO = ?;",[iteminfo.itemnoinfo],  function(err, rows) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve("Request for contact number is successfully updated");
                    } 
                })
            } else{
                conn.query("UPDATE "+process.env.DB_SCHEMA+".ITEM_INFO SET TAKER_ACCOUNT1_RESPONSE_TO_PHONE_NO = 'N', TAKER_ACCOUNT1 = NULL, TAKER_ACCOUNT1_ACCESS_TO_PHONE_NO = 'N' WHERE ITEM_NO = ? ;",[iteminfo.itemnoinfo],  function(err, rows) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve("Request for contact number is successfully updated");
                    } 
                })
            }
        });
    });
}

let replyTakerAccount2 = (iteminfo) => {
    console.log('profileService: replyTakerAccount2')
    return new Promise(async (resolve, reject) => {
        ibmdb.open(connStr, function (err, conn) {
            if (err) throw err;
            if (iteminfo.acceptrejectinfo == 'Y') {
                conn.query("UPDATE "+process.env.DB_SCHEMA+".ITEM_INFO SET TAKER_ACCOUNT2_RESPONSE_TO_PHONE_NO = 'Y' WHERE ITEM_NO = ?;",[iteminfo.itemnoinfo],  function(err, rows) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve("Request for contact number is successfully updated");
                    } 
                })
            } else{
                conn.query("UPDATE "+process.env.DB_SCHEMA+".ITEM_INFO SET TAKER_ACCOUNT2_RESPONSE_TO_PHONE_NO = 'N', TAKER_ACCOUNT2 = NULL, TAKER_ACCOUNT2_ACCESS_TO_PHONE_NO = 'N' WHERE ITEM_NO = ? ;",[iteminfo.itemnoinfo],  function(err, rows) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve("Request for contact number is successfully updated");
                    } 
                })
            }
        });
    });
}

let replyTakerAccount3 = (iteminfo) => {
    console.log('profileService: replyTakerAccount3')
    return new Promise(async (resolve, reject) => {
        ibmdb.open(connStr, function (err, conn) {
            if (err) throw err;
            if (iteminfo.acceptrejectinfo == 'Y') {
                conn.query("UPDATE "+process.env.DB_SCHEMA+".ITEM_INFO SET TAKER_ACCOUNT3_RESPONSE_TO_PHONE_NO = 'Y' WHERE ITEM_NO = ?;",[iteminfo.itemnoinfo],  function(err, rows) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve("Request for contact number is successfully updated");
                    } 
                })
            } else{
                conn.query("UPDATE "+process.env.DB_SCHEMA+".ITEM_INFO SET TAKER_ACCOUNT3_RESPONSE_TO_PHONE_NO = 'N', TAKER_ACCOUNT3 = NULL, TAKER_ACCOUNT3_ACCESS_TO_PHONE_NO = 'N' WHERE ITEM_NO = ? ;",[iteminfo.itemnoinfo],  function(err, rows) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve("Request for contact number is successfully updated");
                    } 
                })
            }
        });
    });
}

let extractTakingRequest = (account) => {
    console.log('profileService: extractTakingRequest')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                let count = process.env.FETCH_ROW_COUNT;
                conn.query("select * from "+process.env.DB_SCHEMA+".ITEM_INFO   \
                            where  TAKER_ACCOUNT1 = ?                           \
                               or  TAKER_ACCOUNT2 = ?                           \
                               or  TAKER_ACCOUNT3 = ?                           \
                            order by LAST_UPDATED_TS DESC                       \
                            fetch first ? rows only                             \
                            with ur;", [account, account, account, count], function(err, rows) {
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


module.exports = {
    createPickupRequestWithFile: createPickupRequestWithFile,
    createPickupRequestWithoutFile: createPickupRequestWithoutFile,
    getPickupRequestNumber: getPickupRequestNumber,
    extractPickupRequest: extractPickupRequest,
    getGivingHistoryForEditPage: getGivingHistoryForEditPage,
    deletePhysicalFile: deletePhysicalFile,
    updatePickupInfoWithFile: updatePickupInfoWithFile,
    updatePickupInfoWithoutFile: updatePickupInfoWithoutFile,
    deletePickupById: deletePickupById,
    getGiversList: getGiversList,
    requestContactNumber: requestContactNumber,
    replyTakerAccount1: replyTakerAccount1,
    replyTakerAccount2: replyTakerAccount2,
    replyTakerAccount3: replyTakerAccount3,
    extractTakingRequest: extractTakingRequest
};