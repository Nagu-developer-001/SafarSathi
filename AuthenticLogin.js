module.exports.isLogined = (req,res,next)=>{
    // let r = req.originalUrl;
    // console.log(r);
    if(!req.isAuthenticated()){
        req.flash("error","!!---PLEASE---LOGIN---!!");
        res.redirect("/login");
        req.session.redirectUrl = req.originalUrl; 
        console.log(redirectUrl);
    }
    next();
}
module.exports.saveUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        req.locals.redirectUrl = req.locals.redirectUrl;
        console.log(req.locals.redirectUrl)
    }
    next();
}