const User = require("../models/user.js");


module.exports.renderSignUp =  (req, res) => {
    res.render("./signup/signup.ejs");
}
module.exports.readValidateSignUp = async (req, res, next) => {
    //const { email, username, password } = req.body;
    res.redirect("/validateotp");
}
module.exports.otpRender = (req,res)=>{
    res.render("./signup/otp.ejs");
}
module.exports.validateOtp = async(req,res)=>{
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
}
module.exports.loginUserRender = (req, res) => {
    res.render("./signup/login.ejs");
}

module.exports.loginUser = (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "listings";
    req.flash("success", "Welcome back to SafarSathi");
    return res.redirect(redirectUrl);
}