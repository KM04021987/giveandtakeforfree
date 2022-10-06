import express from "express";

//Config view engine for app
let configViewEngine = (app)=> {
    console.log('viewEngine: configViewEngine')
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");
    app.set("views","./src/views");
};

module.exports = configViewEngine;