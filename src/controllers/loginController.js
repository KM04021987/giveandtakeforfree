import loginService from "../services/loginService";
import { validationResult } from "express-validator";

let getPageLogin = (req, res) => {
    console.log('loginController: getPageLogin')
    return res.render("login.ejs", {
        errors: req.flash("errors")
    });
};

let getPageRegister = (req, res) => {
    console.log('loginController: getPageRegister')
    return res.render("register.ejs", {
        errors: req.flash("errors")
    });
};

let createNewUser = async (req, res) => {
    console.log('loginController: createNewUser')
    //validate required fields
    let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/register");
    }

    //create a new user
    let newUser = {
        fullname: req.body.fullname,
        phone: req.body.phone,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        pin: req.body.pin,
        address: req.body.address,
        password: req.body.password
    };
    
    try {
        await loginService.createNewUser(newUser);
        return res.json({
            "message": "Success!. The account is created successfully. You can login now."
        })
    } catch (err) {
        req.flash("errors", err);
        return res.json({
            "message": err
        });
    }
};

let checkLoggedIn = (req, res, next) => {
    console.log('loginController: checkLoggedIn')
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
};

let checkLoggedOut = (req, res, next) => {
    console.log('loginController: checkLoggedOut')
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
};

let postLogOut = (req, res) => {
    console.log('loginController: postLogOut')
    req.session.destroy(function(err) {
        return res.redirect("/");
    });
};

module.exports = {
    getPageLogin: getPageLogin,
    getPageRegister: getPageRegister,
    createNewUser: createNewUser,
    checkLoggedIn: checkLoggedIn,
    checkLoggedOut: checkLoggedOut,
    postLogOut: postLogOut
};