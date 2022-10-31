import express from "express";
import homePageController from "../controllers/homePageController"
import loginController from "../controllers/loginController"
import profileController from "../controllers/profileController";
import auth from "../validation/authValidation";
import passport from "passport";
import initPassportLocal from "../controllers/passportLocalController";


// Init all passport
initPassportLocal();

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homePageController.getHomePage);
/*Home Page - Starts*/
    router.get("/about", homePageController.getAboutPage);
    router.get("/category", homePageController.getCategoryPage);
    router.get("/stepstofollow", homePageController.getStepstofollowPage);

    router.get("/privacy", homePageController.getPrivacyPage);
    router.get("/faq", homePageController.getFaqPage);
    router.get("/contact", homePageController.getContactPage);
    router.post("/contact", homePageController.postContactQueriesPage);
/*Home Page - Ends*/

/*Register, Login Authentication & Logout - Starts*/
    router.get("/login", loginController.getPageLogin);
    router.get("/register", loginController.getPageRegister);
    router.post("/register", auth.validateRegister, loginController.createNewUser);


    router.get("/login.ejs", loginController.checkLoggedIn, profileController.handlePage);
    router.get("/login", loginController.checkLoggedOut, loginController.getPageLogin);

    router.post("/login", passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/login",
        successFlash: true,
        failureFlash: true
    }));

    router.get("/profile", profileController.handlePage);

    router.post("/logout", loginController.postLogOut);
    
/*Register, Login Authentication & Logout - Ends*/

/*My Profile - Starts*/
    router.get('/get-edit-profile/:id', profileController.getEditProfile);
    router.put('/put-edit-profile', profileController.putEditProfile);
    router.get('/get-change-password/:id', profileController.getChangePassword);
    router.put('/put-change-password', profileController.putChangePassword);
    router.get('/delete-profile/:id', profileController.deleteProfile);

    router.get("/get-give-something/:id", profileController.getGiveSomething);
    //router.post("/post-give-something/:id", profileController.uploadImage.single('uploaded_image'), profileController.postGiveSomething);

/*My Profile - Ends*/
    
    return app.use("/", router);
};

module.exports = initWebRoutes;