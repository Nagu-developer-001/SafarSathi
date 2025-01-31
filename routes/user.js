const express = require("express");
const router = express.Router({mergeParams:true});

const mongoose = require("mongoose");
const User = require("../models/user.js");
const passport = require("passport");
const flash = require("connect-flash");
const crypto = require('crypto');
const { saveUrl , UniqueUrl,validateRegister,setValues} = require("../AuthenticLogin.js");

router.get("/signup", (req, res) => {
    res.render("./signup/signup.ejs");
});

router.post("/signup",validateRegister,saveUrl,async (req, res, next) => {
    //const { email, username, password } = req.body;
    res.redirect("/validateotp");
});
router.get("/validateotp",(req,res)=>{
    res.render("./signup/otp.ejs");
});
router.post("/validateotp",async(req,res)=>{
    let email = req.session.email;
    let username = req.session.username;
    let password = req.session.password;
    let otp = req.body;
    otp = otp.otp.join("");
    if(otp == req.session.otp){
        const newUser = new User({ email, username });
        const regUser = await User.register(newUser, password);
        console.log("sending email");
        req.login(regUser, (err) => {
            if (err) {
                return next(err);
            }
            //requested url
            req.flash("success","Welcome to SafarSathi");
            res.redirect("/listings");
        });
    }else{
        req.flash("error","You Entered wrong OTP");
        res.redirect("/signup");
    }
});

router.get("/login", (req, res) => {
    res.render("./signup/login.ejs");
});

router.post(
    "/login",
    saveUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        const redirectUrl = res.locals.redirectUrl || "listings";
        req.flash("success", "Welcome back to SafarSathi");
        return res.redirect(redirectUrl);
    }
);

router.get("/logout", (req, res, next) => {
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "You logged out");
            res.redirect("/listings");
        });
    } else {
        req.flash("error", "You are not logged in");
        res.redirect("/login");
    }
});
router.get("/forgotPassword",(req,res)=>{
    res.render("./signup/forgotEmail.ejs");
});

router.post("/forgotPassword",async(req,res)=>{
    let {Re_email,password,Cpassword} = req.body;
    console.log(Re_email);
    let listingUser = await User.findOne({email:Re_email});
    console.log(listingUser);
    if(!listingUser){
        req.flash("error","Account not found!!");
        console.log("ERROR-A/c not found");
        return res.redirect("/forgotPassword");
    }
    if(password!=Cpassword){
        req.flash("error","write the both password correctly!");
        return res.redirect("/forgotPassword");
    }
    await listingUser.setPassword(Cpassword);
    await listingUser.save();
    req.flash("success","Successfully Updated password!");
    res.redirect("/login");
});
module.exports = router;