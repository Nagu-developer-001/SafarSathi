const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user.js");
const passport = require("passport");
const flash = require("connect-flash");

const { saveUrl } = require("../AuthenticLogin.js");


router.get("/signup", (req, res) => {
    res.render("./signup/signup.ejs");
});

router.post("/signup", async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const regUser = await User.register(newUser, password);
        req.login(regUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to SafarSathi!!!");
            res.redirect("/listings");
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
        const redirectUrl = res.locals.redirectUrl || "/listings";
        req.flash("success", "Welcome back to SafarSathi");
        res.redirect(redirectUrl);
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

module.exports = router;