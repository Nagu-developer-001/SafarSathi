const express = require("express");
const router = express.Router({mergeParams:true});

const mongoose = require("mongoose");
const User = require("../models/user.js");
const passport = require("passport");
const flash = require("connect-flash");

const { saveUrl ,emailConformation, UniqueUrl} = require("../AuthenticLogin.js");


router.get("/signup",(req, res) => {
    res.render("./signup/signup.ejs");
});

router.post("/signup",emailConformation,saveUrl,async(req, res, next) => {
    console.log("conforming...");
});
router.get("/confirm",async(req,res)=>{
    try{
        const { email, username,password,response } = req.query;
    if(response==='yes'){
        const newUser = new User({ email, username });
    const regUser = await User.register(newUser, password);
    req.login(regUser, (err) => {
        if (err) {
            return next(err);
        }
                    //requested url
        let redirectUnique = "/listings";
        req.flash("success", "Welcome to SafarSathi!!!");
        res.redirect(redirectUnique);
    })
    }else{
        req.flash("success", "Thank you for your responce!!!");
        res.redirect("/listings");
    }
    }catch(e){
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



"---------------------------------------------------------------------------------------------------------------------"
module.exports.emailConformation = (req,res,next)=>{
  const { email, username, password } = req.body;
  const responseYesLink = `http://localhost:8080/confirm?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&response=yes`; 
  const responseNoLink = `http://localhost:8080/confirm?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&response=no`;;
  try {
          console.log("sending email");
          const send = require('gmail-send')({
              user: 'trivikramapvtltd524@gmail.com',
              pass: 'cetunqqeqilwiiir',
              to:   email,
              subject: 'subject -  ',
          });
          send({
              html: `<p>Thank you for registering to SafarSathi, Mr. Naveen.</p> 
              <p>Please click one of the buttons below to confirm your registration:</p> 
              <p><a href="${responseYesLink}" style="padding: 10px 20px; background-color: green; color: white; text-decoration: none;">Yes</a></p> 
              <p><a href="${responseNoLink}" style="padding: 10px 20px; background-color: red; color: white; text-decoration: none;">No</a></p>`,  
          }, async(error, result, fullResult) => {
              if (error) console.error(error);
              console.log(fullResult.accepted);
          })
          next();
}catch(e){
  console.log(e);
}}