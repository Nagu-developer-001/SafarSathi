const express = require("express");
const router = express.Router({mergeParams:true});
const mongoose = require("mongoose");
const User = require("../models/user.js");
const passport = require("passport");
const flash = require("connect-flash");
const {Redirection} = require("../AuthenticLogin.js");



router.get("/signup",(req,res)=>{
    res.render("./signup/signup.ejs")
});

router.post("/signup",async(req,res)=>{
    try{
        let {email,username,password}= req.body;
    let newUser = new User({
        email:email,
        username:username,
    });
    let regUser= await User.register(newUser,password);
    req.login(regUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to SafarSathi!!!");
        res.redirect("/listings");
    });
    }catch(e){
        req.flash("failure",e.message);
        res.redirect("/signup");
    }
});




router.get("/login",(req,res)=>{
    res.render("./signup/login.ejs");
});

router.post("/login",Redirection,
    passport.authenticate("local",
    { failureRedirect: "/login",failureFlash : true }),async(req,res)=>{
    req.flash("success","Welcome back to SafarSathi");
    console.log();
    res.redirect(req.locals.redirectUrl);
});


router.get("/logout",(req,res,next)=>{
    //.originalUrl);
    if(req.user!=undefined){
        req.logout((err)=>{
            if(err){
                next(err);
            }
            req.flash("success","You logged out");
            res.redirect("/listings");
        });
    }
});

module.exports = router;