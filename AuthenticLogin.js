const placeList = require("./models/wonderLust.js");
const Review = require("./models/review.js");



module.exports.isLogined = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error", "!!---PLEASE---LOGIN---!!");
        console.log(req.session.redirectUrl); 
        res.redirect("/login"); 
    }
    next();
};

module.exports.saveUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; 
        console.log(res.locals.redirectUrl);
    }
    next();
};

module.exports.listOwner = async(req,res,next) =>{
    let {id} = req.params;
    let content = await placeList.findById(id);
    if(content.owner._id.equals(res.locals.nowUser._id)){
        console.log("USER AUTHENTICATED SUCCESSFULLY");
        res.render("listings/edit.ejs",{content});
    }else{
        req.flash("error","You are not allowed to access!!!");
        res.redirect(`/listings/${id}`);
    }
    next();
}

// module.exports.reviewOwner = async(req,res,next) =>{
//     let {id} = req.params;
//     let content = await Review.findById(id);
//     if(!content.author._id.equals(res.locals.nowUser._id)){
//         console.log("USER AUTHENTICATED SUCCESSFULLY");
//         req.flash("error","You are not allowed to access!!!");
//         res.redirect(`/listings/${id}`);
//     }
//     next();
// }