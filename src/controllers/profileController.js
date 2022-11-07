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
        phone: req.body.phone
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



module.exports = {
    handlePage: handlePage,
    getEditProfile: getEditProfile,
    putEditProfile: putEditProfile,
    getChangePassword: getChangePassword,
    putChangePassword: putChangePassword,
    deleteProfile: deleteProfile,
    getGiveSomething: getGiveSomething,
    uploadImage: uploadImage,
    postGiveSomething: postGiveSomething
}