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
        if (!user) {
            //return res.render("donorprofilenotcorrect.ejs")
            console.log('Profile not found')
        }
        else {
            return res.render("userprofile.ejs",{
                donoraccount: jsonaccount,
                fullname: jsonfullname,
                phone: jsonphone_no,
                country: jsoncountry,
                state: jsonstate,
                city: jsoncity,
                pin: jsonpin_or_zip,
                address: jsonaddress
            });
        }
    })
};

module.exports = {
    handlePage: handlePage
}
