const express = require("express");
const router = express.Router({mergeParams:true});

const mongoose = require("mongoose");
const User = require("../models/user.js");
const passport = require("passport");
const flash = require("connect-flash");

const { saveUrl , UniqueUrl} = require("../AuthenticLogin.js");


router.get("/signup", (req, res) => {
    res.render("./signup/signup.ejs");
});

router.post("/signup",saveUrl,async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        console.log("sending email");
        
        const send = require('gmail-send')({
            user: 'trivikramapvtltd524@gmail.com',
            pass: 'cetunqqeqilwiiir',
            to:   email,
            subject: 'subject -  ',
        });
        send({
            html:    `<p>Welcome to SufarSathi a tourist accomodation platform that simplifies accomodation booking throughout the journey</p><br><h4>Hope our journey would be ever lasting!!!.....</h4>`,
        }, async(error, result, fullResult) => {
            if (error) console.error(error);
            console.log(fullResult.accepted);
            console.log(fullResult)
            let n = fullResult.accepted.length
            if(n==0){
                req.flash("error","Please enter a valid email id");
            }else{
                const newUser = new User({ email, username });
                const regUser = await User.register(newUser, password);
                console.log("sending email");
                req.login(regUser, (err) => {
                    if (err) {
                        return next(err);
                    }
                    //requested url
                    let redirectUnique = req.session.requestedUrl||res.locals.redirectUrlUnique||"/listings";
                    req.flash("success", "Welcome to SafarSathi!!!");
                    res.redirect(redirectUnique);
                });
            }
        });
    } catch (e) {
        req.flash("failure", e.message);
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
        const redirectUrl = res.locals.redirectUrl || res.locals.redirectUrlUnique || "listings";
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