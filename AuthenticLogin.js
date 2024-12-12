module.exports.isLogined = (req,res,next)=>{
    // let r = req.originalUrl;
    // console.log(r);
    if(!req.isAuthenticated()){
        //req.session.redirectUrl = req.originalUrl; 
        req.flash("error","!!---PLEASE---LOGIN---!!");
        res.redirect("/login");
    }
    next();
}
module.exports = function re(req,res,next){
    console.log("hello");
}