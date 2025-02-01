const express = require("express");
const router = express.Router({mergeParams:true});

const mongoose = require("mongoose");
const User = require("../models/user.js");
const passport = require("passport");
const flash = require("connect-flash");
const crypto = require('crypto');
const { saveUrl , UniqueUrl,validateRegister,setValues} = require("../AuthenticLogin.js");

const userController = require("../controllers/users.js");

router.get("/signup",userController.renderSignUp);

router.post("/signup",validateRegister,saveUrl,userController.readValidateSignUp);
router.get("/validateotp",userController.otpRender);
router.post("/validateotp",userController.validateOtp);

router.get("/login",userController.loginUserRender);

router.post(
    "/login",
    saveUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.loginUser
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