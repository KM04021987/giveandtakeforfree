require('dotenv').config();
import bcrypt from "bcryptjs";
const ibmdb = require('ibm_db');
let connStr = "DATABASE="+process.env.DB_DATABASE+";HOSTNAME="+process.env.DB_HOSTNAME+";PORT="+process.env.DB_PORT+";UID="+process.env.DB_UID+";PWD="+process.env.DB_PWD+";PROTOCOL=TCPIP;SECURITY=SSL";
let nodeGeocoder = require('node-geocoder');

let createNewUser = (data) => {
    console.log('loginService: createNewUser')
    return new Promise(async (resolve, reject) => {
        // check phone number exists or not
        let isPhoneExist = await checkExistPhone(data.phone);
        if (isPhoneExist) {
            reject(`This phone "${data.phone}" already exists in our database. Please choose another phone number.`);
        } else {
            // hash password
            let salt = bcrypt.genSaltSync(10);
            let pass = bcrypt.hashSync(data.password, salt);
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
                const ulatitude = jsonParseobj.latitude
                const ulongitude = jsonParseobj.longitude
                const ucountry = jsonParseobj.country
                const ustate = jsonParseobj.state
                const upin = jsonParseobj.zipcode


            //create a new account
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err; 
                if(ucountry === data.country && ustate === data.state && upin === data.pin)  {        
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".user_info (fullname, phone_no, country, state, city, pin_or_zip, address, latitude, longitude, password) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [data.fullname, data.phone, data.country, data.state, data.city, data.pin, data.address, ulatitude, ulongitude, pass], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("A new user is successfully created");
                })
                } else {
                conn.query("INSERT INTO "+process.env.DB_SCHEMA+".user_info (fullname, phone_no, country, state, city, pin_or_zip, address, password) values(?, ?, ?, ?, ?, ?, ?, ?);", [data.fullname, data.phone, data.country, data.state, data.city, data.pin, data.address, pass], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("A new user is successfully created");
                })
                }
            });
        })
        .catch((err)=> {
            console.log(err);
        });
        }
    });
};

let checkExistPhone = (phone) => {
    console.log('loginService: checkExistPhone')
    return new Promise( (resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".user_info where phone_no=? with ur", [phone], function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    if (rows.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let findUserByPhone = (phone) => {
    console.log('loginService: findUserByPhone')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".user_info WHERE phone_no=? with ur;", [phone], function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let user = rows[0];
                    resolve(user);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let comparePassword = (password, user) => {
    console.log('loginService: comparePassword')
    return new Promise(async (resolve, reject) => {
        try {
            const jsonData = JSON.stringify(user)
            const jsonDataObj = JSON.parse(jsonData)
            const jsonPasword = jsonDataObj.PASSWORD
            await bcrypt.compare(password, jsonPasword).then((isMatch) => {
                if (isMatch) {
                    resolve(true);
                } else {
                    resolve(`The password that you've entered is incorrect`);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let findUserByAccount = (account) => {
    console.log('loginService: findUserByAccount')
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".user_info WHERE account=? with ur;", [account], function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let user = rows[0];
                    resolve(user);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let editProfile = (data) => {
    console.log('loginService: editProfile')
    return new Promise(async (resolve, reject) => {
        // check phone number is exist or not
        ibmdb.open(connStr, function (err, conn) {
            if (err) throw err;
            conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".user_info where phone_no=? and account <> ? with ur", [data.phone, data.account], function(err, rows) {
                if (err) {
                    reject(err)
                }
                if (rows.length > 0) {
                    reject(`This phone "${data.phone}" has already exist in database. Please choose another phone number. `);
                } else {
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
                        const ulatitude = jsonParseobj.latitude
                        const ulongitude = jsonParseobj.longitude
                        const ucountry = jsonParseobj.country
                        const ustate = jsonParseobj.state
                        const upin = jsonParseobj.zipcode

                        //Update profile
                        ibmdb.open(connStr, function (err, conn) {
                            if (err) throw err; 
                            if(ucountry === data.country && ustate === data.state && upin === data.pin)  {        
                            conn.query("UPDATE "+process.env.DB_SCHEMA+".user_info SET phone_no = ?, country = ?, state = ?, city = ?, pin_or_zip = ?, address = ?, latitude = ?, longitude = ? where account = ?;", [data.phone, data.country, data.state, data.city, data.pin, data.address, ulatitude, ulongitude, data.account], function(err, rows) {
                                if (err) {
                                    reject(false)
                                }
                                resolve("User profile is updated with latitude and longitude");
                            })
                            } else {
                            conn.query("UPDATE "+process.env.DB_SCHEMA+".user_info SET phone_no = ?, country = ?, state = ?, city = ?, pin_or_zip = ?, address = ?, latitude = ?, longitude = ? where account = ?;", [data.phone, data.country, data.state, data.city, data.pin, data.address, ulatitude, ulongitude, data.account], function(err, rows) {
                                if (err) {
                                    reject(false)
                                }
                                resolve("User profile is updated without latitude and longitude");
                            })
                            }
                        });
                    })
                    .catch((err)=> {
                        console.log(err);
                    });
                    }
                });
        })
    })
};

module.exports = {
    createNewUser: createNewUser,
    findUserByPhone: findUserByPhone,
    comparePassword: comparePassword,
    findUserByAccount: findUserByAccount,
    editProfile: editProfile
};