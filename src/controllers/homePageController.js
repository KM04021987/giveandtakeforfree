import homepageService from "./../services/homepageService";

let getHomePage = (req, res) => {
    console.log('homePageController: getHomePage')
    return res.render("home.ejs", {
        errors: req.flash("errors")
    });
};

let getAboutPage = (req, res) => {
    console.log('homePageController: getAboutPage')
    return res.render("homeabout.ejs", {
        errors: req.flash("errors")
    });
};

let getCategoryPage = (req, res) => {
    console.log('homePageController: getCategoryPage')
    return res.render("homecategory.ejs", {
        errors: req.flash("errors")
    });
};

let getStepstofollowPage = (req, res) => {
    console.log('homePageController: getStepstofollowPage')
    return res.render("homestepstofollow.ejs", {
        errors: req.flash("errors")
    });
};

let getPrivacyPage = (req, res) => {
    console.log('homePageController: getPrivacyPage')
    return res.render("homeprivacy.ejs", {
        errors: req.flash("errors")
    });
};

let getFaqPage = (req, res) => {
    console.log('homePageController: getFaqPage')
    return res.render("homefaq.ejs", {
        errors: req.flash("errors")
    });
};

let getContactPage = (req, res) => {
    console.log('homePageController: getContactPage')
    return res.render("homecontact.ejs", {
        errors: req.flash("errors")
    });
};


let postContactQueriesPage = async (req, res) => {
    console.log('homePageController: postContactQueriesPage')
    let postmessage = {
        fullname: req.body.fullname,
        email: req.body.email,
        messagecontent: req.body.messagecontent
    }
    try {
        await homepageService.postContactQueries(postmessage);
        return res.json({
            'message': 'Success!. The queries are posted successfully.'
        })
    } catch (err) {
        return res.json({
            "message": err
        });
    }
};

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCategoryPage: getCategoryPage,
    getStepstofollowPage: getStepstofollowPage,
    getPrivacyPage: getPrivacyPage,
    getFaqPage: getFaqPage,
    getContactPage: getContactPage,
    postContactQueriesPage: postContactQueriesPage
};