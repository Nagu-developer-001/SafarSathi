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

router.get("/logout", userController.logoutUser);
router.get("/forgotPassword",userController.forgotPassword);

router.post("/forgotPassword",userController.validatePassword);
module.exports = router;