const express = require("express");
const router = express.Router({mergeParams:true});

const mongoose = require("mongoose");
const User = require("../models/user.js");
const passport = require("passport");
const flash = require("connect-flash");
const crypto = require('crypto');
const { saveUrl ,validateRegister,validateUpdateUser} = require("../AuthenticLogin.js");
// const {validateUpdateUser} = require("../joiSchema.js");
const userController = require("../controllers/users.js");

const multer  = require('multer');
const {storage} = require("../cloudConfigure.js");
const upload = multer({ storage: storage });



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

router.get("/userDetails/:id",async(req,res)=>{
    let {id} = req.params;
    let user = await User.findById(id);
    res.render("./signup/userDetails.ejs",{user});
});
router.post("/updateUser/:id/edit",upload.single('userData[image]'),validateUpdateUser,async(req,res)=>{
    let id = req.params.id;
    console.log(id);
    let data = await User.findByIdAndUpdate(id,{...req.body.userData});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        data.image = {url,filename};
        await data.save();
        console.log(data);
    }
    await data.save();
    req.flash("success","Your Personal Details Edited Successfully!");
    console.log(id);
    res.redirect(`/userDetails/${id}`);
});


router.get("/logout", userController.logoutUser);
router.get("/forgotPassword",userController.forgotPassword);

router.post("/forgotPassword",userController.validatePassword);
module.exports = router;