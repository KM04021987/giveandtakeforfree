import loginService from "./../services/loginService";
import profileService from "./../services/profileService";

let handlePage = async (req, res) => {
    console.log('profileController: handlePage')
    const jsonData = JSON.stringify(req.user)
    const jsonParseObj = JSON.parse(jsonData)
    const jsonaccount = jsonParseObj.ACCOUNT
    const jsonfullname = jsonParseObj.FULLNAME
    const jsonphone_no = jsonParseObj.PHONE_NO
    const jsoncountry = jsonParseObj.COUNTRY
    const jsonstate = jsonParseObj.STATE
    const jsoncity = jsonParseObj.CITY
    const jsonpin_or_zip = jsonParseObj.PIN_OR_ZIP
    const jsonaddress = jsonParseObj.ADDRESS

    loginService.findUserByPhone(jsonphone_no).then(async (user) => {
        return res.render("userprofile.ejs",{
            account: jsonaccount,
            fullname: jsonfullname,
            phone: jsonphone_no,
            country: jsoncountry,
            state: jsonstate,
            city: jsoncity,
            pin: jsonpin_or_zip,
            address: jsonaddress
        });
    })
};

let getEditProfile = async (req, res) => {
    console.log('profileController: getEditProfile')
    const account = req.params.id

    await loginService.findUserByAccount(account).then((profile) => {
        const jsonData = JSON.stringify(profile)
        const removebracket1 = jsonData.replace('[','')
        const removebracket2 = removebracket1.replace(']','')
        const jsonParseobj = JSON.parse(removebracket2)

        const fullname = jsonParseobj.FULLNAME
        const phone = jsonParseobj.PHONE_NO
        const country = jsonParseobj.COUNTRY
        const state = jsonParseobj.STATE
        const city = jsonParseobj.CITY
        const pin = jsonParseobj.PIN_OR_ZIP
        const address = jsonParseobj.ADDRESS

    return res.render("usereditprofile.ejs", {
        account: account,
        fullname: fullname,
        phone: phone,
        country: country,
        state: state,
        city: city,
        pin: pin,
        address: address
    })
    }).catch(error => {
        console.log('error while getting user profile edit page')
    });
};


let putEditProfile = async (req, res) => {
    console.log('profileController: putEditProfile')
    const jsonData = JSON.stringify(req.user)
    const jsonParseObj = JSON.parse(jsonData)
    const jsonaccount = jsonParseObj.ACCOUNT
    let updateUser = {
        account: jsonaccount,
        phone: req.body.phone,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        pin: req.body.pin,
        address: req.body.address
    };
    try {
        await loginService.editProfile(updateUser);
        return res.json({
            message: 'Success!. Profile is successfully updated'
        });
    } catch (err) {
        return res.json({
            "message": err
        });
    }
};

let getChangePassword = async (req, res) => {
    console.log('profileController: getChangePassword')
    const account = req.params.id

    await loginService.findUserByAccount(account).then((profile) => {
        const jsonData = JSON.stringify(profile)
        const removebracket1 = jsonData.replace('[','')
        const removebracket2 = removebracket1.replace(']','')
        const jsonParseobj = JSON.parse(removebracket2)

        const fullname = jsonParseobj.FULLNAME
        const phone = jsonParseobj.PHONE_NO
        const country = jsonParseobj.COUNTRY
        const state = jsonParseobj.STATE
        const city = jsonParseobj.CITY
        const pin = jsonParseobj.PIN_OR_ZIP
        const address = jsonParseobj.ADDRESS

    return res.render("userchangepassword.ejs", {
        account: account,
        fullname: fullname,
        phone: phone,
        country: country,
        state: state,
        city: city,
        pin: pin,
        address: address
    })
    }).catch(error => {
        console.log('error while fetching profile to change the password')
    });
};

let putChangePassword = async (req, res) => {
    console.log('profileController: putChangePassword')
    const jsonData = JSON.stringify(req.user)
    const jsonParseObj = JSON.parse(jsonData)
    const savedPassword = jsonParseObj.PASSWORD
    const account = jsonParseObj.ACCOUNT

    //Update user's password
    let updatePassword = {
        account: account,
        oldpassword: req.body.opassword,
        newpassword: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation,
        savedPassword: savedPassword
    };


    try {
        await loginService.updatePassword(updatePassword);
        return res.json({
            message: 'Success!. Password is successfully updated'
        });
    } catch (err) {
        return res.json({
            "message": err
        });
    }
};

let deleteProfile = async (req, res) => {
    console.log('profileController: deleteProfile')
    const account = req.params.id
    try {
        await loginService.deleteProfile(account);
        req.session.destroy(function(err) {
            return res.redirect("/");
        });      
    } catch (err) {
        console.log('error while deleting user profile')
    }
};

let getGiveSomething = async (req, res) => {
    console.log('profileController: getGiveSomething')
    const account = req.params.id
    return res.render("usergivesomething.ejs", {
        account: account
    })
}

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadImage = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, callback) => {
        if(file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/gif' ||
        file.mimetype === 'image/webp') {
            callback(null, true);
        } else {
            callback(null, false);
            req.fileError = 'File format is not valid';
        }
    }
 })

let postGiveSomething = async (req, res) => {
    console.log('profileController: postGiveSomething')

    const account = req.params.id
    const radiobutton = req.body.radiobutton
    //create a pickup request
    let pickupRequest = {
        account: account,
        category: req.body.category,
        subcategory: req.body.subcategory,
        itemname: req.body.itemname,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        pin: req.body.pin,
        address: req.body.address,
        phone: req.body.phone,
        giver_phone_no_display: req.body.giver_phone_no_display
    };
    
    if (radiobutton === 'yes') {
        const result = await cloudinary.uploader.upload(req.file.path);
        const cloudinary_public_id = result.public_id
        const cloudinary_secure_url = result.secure_url
        await profileService.createPickupRequestWithFile(pickupRequest, cloudinary_public_id, cloudinary_secure_url).then(() => {
            profileService.getPickupRequestNumber(account).then((data) => {
                const jsonData = JSON.stringify(data)
                const removebracket1 = jsonData.replace('[','')
                const removebracket2 = removebracket1.replace(']','')
                const jsonParseobj = JSON.parse(removebracket2)
                const pickupRequestNumber = jsonParseobj.ITEM_NO

                return res.render("alertsuccessgivesomething.ejs", {
                    account: account,
                    pickupRequestNumber: pickupRequestNumber
                })
            }).catch(error => {
                console.log("error while fetching pickup request(With File)")
            });
        }).catch(error => {
            console.log("error while creating a new pickup request(With File)")
        });
    }
    else {
        await profileService.createPickupRequestWithoutFile(pickupRequest).then(() => {
            profileService.getPickupRequestNumber(account).then((data) => {
                const jsonData = JSON.stringify(data)
                const removebracket1 = jsonData.replace('[','')
                const removebracket2 = removebracket1.replace(']','')
                const jsonParseobj = JSON.parse(removebracket2)
                const pickupRequestNumber = jsonParseobj.ITEM_NO

                return res.render("alertsuccessgivesomething.ejs", {
                    account: account,
                    pickupRequestNumber: pickupRequestNumber
                })
            }).catch(error => {
                console.log("error while fetching pickup request(Without File)")
            });
        }).catch(error => {
            console.log("error while creating a new pickup request(Without File)")
        });
    }
};


let getGivingHistory = async (req, res) => {
    console.log('profileController: getGivingHistory')
    const account = req.params.id

    profileService.extractPickupRequest(account).then((data) => {
        return res.render("usergivinghistory.ejs",{
            account: account,
            userData: data
        });
    }).catch(error => {
        console.log('error in getGivingHistory')
    });
};

let getEditGivingHistory = async (req, res) => {
    console.log('profileController: getEditGivingHistory')
    const itemno = req.params.id
    await profileService.getGivingHistoryForEditPage(itemno).then((pickup) => {
    const jsonData = JSON.stringify(pickup)
    const removebracket1 = jsonData.replace('[','')
    const removebracket2 = removebracket1.replace(']','')
    const jsonParseobj = JSON.parse(removebracket2)

    const jsonITEM_NO = jsonParseobj.ITEM_NO
    const jsonGIVER_ACCOUNT = jsonParseobj.GIVER_ACCOUNT
    const jsonITEM_CATEGORY = jsonParseobj.ITEM_CATEGORY
    const jsonITEM_SUBCATEGORY = jsonParseobj.ITEM_SUBCATEGORY
    const jsonITEM_NAME = jsonParseobj.ITEM_NAME
    const jsonGIVER_COUNTRY = jsonParseobj.GIVER_COUNTRY
    const jsonGIVER_STATE = jsonParseobj.GIVER_STATE
    const jsonGIVER_CITY = jsonParseobj.GIVER_CITY
    const jsonGIVER_PIN_OR_ZIP = jsonParseobj.GIVER_PIN_OR_ZIP
    const jsonGIVER_ADDRESS = jsonParseobj.GIVER_ADDRESS
    const jsonGIVER_PHONE_NO = jsonParseobj.GIVER_PHONE_NO
    const jsonIMAGE_CLOUDINARY_SECURE_URL = jsonParseobj.IMAGE_CLOUDINARY_SECURE_URL

    return res.render("usergivinghistoryedit.ejs", {
        account: jsonGIVER_ACCOUNT,
        ITEM_NO: jsonITEM_NO,
        ITEM_CATEGORY: jsonITEM_CATEGORY,
        ITEM_SUBCATEGORY: jsonITEM_SUBCATEGORY,
        ITEM_NAME: jsonITEM_NAME,
        GIVER_COUNTRY: jsonGIVER_COUNTRY,
        GIVER_STATE: jsonGIVER_STATE,
        GIVER_CITY: jsonGIVER_CITY,
        GIVER_PIN_OR_ZIP: jsonGIVER_PIN_OR_ZIP,
        GIVER_ADDRESS: jsonGIVER_ADDRESS,
        GIVER_PHONE_NO: jsonGIVER_PHONE_NO,
        IMAGE_CLOUDINARY_SECURE_URL: jsonIMAGE_CLOUDINARY_SECURE_URL
    })
    }).catch(error => {
    console.log('error while fetching giving history')
    });
};

let putEditGivingHistory = async (req, res) => {
    console.log('profileController: putEditGivingHistory')
    const account = req.body.account
    const radiobutton = req.body.radiobutton
    const itemno = req.params.id

    let item = {
        account: account,
        itemno: itemno,
        category: req.body.category,
        subcategory: req.body.subcategory,
        itemname: req.body.itemname,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        pin: req.body.pin,
        address: req.body.address,
        phone: req.body.phone
    };

    if (radiobutton === 'yes') {
        const result = await cloudinary.uploader.upload(req.file.path);
        const cloudinary_public_id = result.public_id
        const cloudinary_secure_url = result.secure_url
        await profileService.deletePhysicalFile(itemno).then(() => {
            profileService.updatePickupInfoWithFile(item, cloudinary_public_id, cloudinary_secure_url).then(() => {
                profileService.extractPickupRequest(account).then((data) => {
                    return res.render("usergivinghistory.ejs",{
                        account: account,
                        userData: data
                    });
                }).catch(error => {
                    console.log('error while extracting list of pickup requests')
                });
            }).catch(error => {
                console.log("error while updating the pickup request(With File)")
            });
        }).catch(error => {
            console.log("error while deleting the Physical File if exists")
        });
    }
    else {
        await profileService.updatePickupInfoWithoutFile(item).then(() => {
            profileService.extractPickupRequest(account).then((data) => {
                return res.render("usergivinghistory.ejs",{
                    account: account,
                    userData: data
                });
            }).catch(error => {
                console.log('error while extracting list of pickup requests')
            });
        }).catch(error => {
            console.log("error while updating the pickup request(Without File)")
        });
    }
};

let deleteGivingHistory = async (req, res) => {
    console.log('profileController: deleteGivingHistory')
    const jsonData = JSON.stringify(req.user)
    const jsonParseObj = JSON.parse(jsonData)
    const jsonaccount = jsonParseObj.ACCOUNT
    await profileService.deletePhysicalFile(req.params.id).then(() => {
        profileService.deletePickupById(req.params.id).then(() => {
            profileService.extractPickupRequest(jsonaccount).then((data) => {
                return res.render("usergivinghistory.ejs",{
                    account: jsonaccount,
                    userData: data
                });
            }).catch(error => {
                console.log('error while extracting the list of pickup requests')
            });
        }).catch(error => {
            console.log("error while deleting the pickup request from DB2 table")
        });
    }).catch(error => {
        console.log("error while deleting the Physical File if exists")
    });
};

let getFindSomething = async (req, res) => {
    console.log('profileController: getFindSomething')
    const account = req.params.id
    const jsonData = JSON.stringify(req.user)
    const jsonParseObj = JSON.parse(jsonData)
    const country = jsonParseObj.COUNTRY
    const state = jsonParseObj.STATE
    const pin = jsonParseObj.PIN_OR_ZIP
    return res.render("userfindsomething.ejs", {
        account: account,
        country: country,
        state: state,
        pin: pin
    })
}

let showListOfGivers = async (req, res) => {
    console.log('profileController: showListOfGivers')
    let account = req.params.id
    let findByInfo = {
        account: account,
        category: req.body.category,
        subcategory: req.body.subcategory,
        country: req.body.country,
        state: req.body.state,
        pin: req.body.pin
    };
    await profileService.getGiversList(findByInfo).then((data) => {
    return res.render("userlistofgivers.ejs", {
        userData: data,
        account: account,
        category: req.body.category,
        subcategory: req.body.subcategory,
        country: req.body.country,
        state: req.body.state,
        pin: req.body.pin
    })
    }).catch(error => {
    console.log('error while finding givers info')
    });
};


let requestContactNumber = async (req, res) => {
    console.log('profileController: requestContactNumber')
    let sendrequest = {
        giveraccount: req.body.account,
        itemno: req.body.itemno
    }  
    try {
        await profileService.requestContactNumber(sendrequest);
        return res.json({
            'message': 'Success!. Your request is posted successfully.'
        })
    } catch (err) {
        return res.json({
            "message": err
        });
    }
};

let replyTakerAccount1 = async (req, res) => {
    console.log('profileController: replyTakerAccount1')
 
    let item = req.body.item;
    let acceptrejectinfo = item.substring(0,1);
    let itemnoinfo = item.substring(1,7);

    let iteminfo = {
        acceptrejectinfo: acceptrejectinfo,
        itemnoinfo: itemnoinfo
    }
    if (acceptrejectinfo == 'Y') {
        try {
            await profileService.replyTakerAccount1(iteminfo);
            return res.json({
                'message': 'Success!. You have successfully accepted the request.'
            })
        } catch (err) {
            return res.json({
                "message": err
            });
        }
    } else {
        try {
            await profileService.replyTakerAccount1(iteminfo);
            return res.json({
                'message': 'Success!. You have successfully rejected the request.'
            })
        } catch (err) {
            return res.json({
                "message": err
            });
        }   
    }
};

let replyTakerAccount2 = async (req, res) => {
    console.log('profileController: replyTakerAccount2')
 
    let item = req.body.item;
    let acceptrejectinfo = item.substring(0,1);
    let itemnoinfo = item.substring(1,7);

    let iteminfo = {
        acceptrejectinfo: acceptrejectinfo,
        itemnoinfo: itemnoinfo
    }
    if (acceptrejectinfo == 'Y') {
        try {
            await profileService.replyTakerAccount2(iteminfo);
            return res.json({
                'message': 'Success!. You have successfully accepted the request.'
            })
        } catch (err) {
            return res.json({
                "message": err
            });
        }
    } else {
        try {
            await profileService.replyTakerAccount2(iteminfo);
            return res.json({
                'message': 'Success!. You have successfully rejected the request.'
            })
        } catch (err) {
            return res.json({
                "message": err
            });
        }   
    }
};


let replyTakerAccount3 = async (req, res) => {
    console.log('profileController: replyTakerAccount3')
 
    let item = req.body.item;
    let acceptrejectinfo = item.substring(0,1);
    let itemnoinfo = item.substring(1,7);

    let iteminfo = {
        acceptrejectinfo: acceptrejectinfo,
        itemnoinfo: itemnoinfo
    }
    if (acceptrejectinfo == 'Y') {
        try {
            await profileService.replyTakerAccount3(iteminfo);
            return res.json({
                'message': 'Success!. You have successfully accepted the request.'
            })
        } catch (err) {
            return res.json({
                "message": err
            });
        }
    } else {
        try {
            await profileService.replyTakerAccount3(iteminfo);
            return res.json({
                'message': 'Success!. You have successfully rejected the request.'
            })
        } catch (err) {
            return res.json({
                "message": err
            });
        }   
    }
};

module.exports = {
    handlePage: handlePage,
    getEditProfile: getEditProfile,
    putEditProfile: putEditProfile,
    getChangePassword: getChangePassword,
    putChangePassword: putChangePassword,
    deleteProfile: deleteProfile,
    getGiveSomething: getGiveSomething,
    uploadImage: uploadImage,
    postGiveSomething: postGiveSomething,
    getGivingHistory: getGivingHistory,
    getEditGivingHistory: getEditGivingHistory,
    putEditGivingHistory: putEditGivingHistory,
    deleteGivingHistory: deleteGivingHistory,
    getFindSomething: getFindSomething,
    showListOfGivers: showListOfGivers,
    requestContactNumber: requestContactNumber,
    replyTakerAccount1: replyTakerAccount1,
    replyTakerAccount2: replyTakerAccount2,
    replyTakerAccount3: replyTakerAccount3
}