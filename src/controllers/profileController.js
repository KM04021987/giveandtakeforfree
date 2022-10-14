import loginService from "./../services/loginService";

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
    } catch (e) {
        console.log(e)
        return res.json({
            "message": err
        });
    }
};



module.exports = {
    handlePage: handlePage,
    getEditProfile: getEditProfile,
    putEditProfile: putEditProfile
}
