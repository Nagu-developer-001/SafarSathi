const express = require("express");
const router = express.Router({mergeParams:true});
const mongoose = require("mongoose");

const placeList = require("../models/wonderLust.js");
const Review = require("../models/review.js");

const ExpressErr = require("../utils/ExpressErr.js");

const {validateUserData,validateUserRating} = require("../joiSchema.js");

const wrapAsync = require("../utils/wrapAsync.js");
const {isLogined} = require("../AuthenticLogin.js");


const validateRating = (req,res,next)=>{
    let {err} = validateUserRating.validate(req.body);//TODO ANOTHER WAY TO GET THE MULTIPLE DATA FROM FORM ...
    console.log(err,"------");
    console.log(err,"!!!!!!");
    if(err){
        let errMsg = err.details.map((el)=>el.message).join(",");
        throw new ExpressErr(404,errMsg);
    }
    else{
        next();
    }
}

//TODO POSTING REVIEWS

router.post("/listings/:id/reviews",isLogined,validateRating,wrapAsync(async(req,res)=>{
    let {rating,comment}=req.body;
    const {id}=req.params;
    console.log(req.body,"rating obj");
    console.log(req.body.reviews,"rating obj-1");
    let listing=await placeList.findById(id);
    let newReview=new Review(req.body.reviews);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Added Successfully");

    res.redirect(`/listings/${listing._id}`);

}));


//TODO DELETE REQUEST
router.delete("/listings/:id/reviews/:reviewsId",wrapAsync(async (req,res) => {
    // res.send("TRYING TO DELETE REVIEWS")
    //console.log("TRYING TO DELETE REVIEWS");
    let id = req.params.id;
    let reviewId  = req.params.reviewsId;
    // console.log(reviewId);
    // console.log(id);
    let re2 = await Review.findByIdAndDelete(reviewId);
    let re1 = await placeList.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("error","Review deleted Successfully");
    // console.log("TRYING TO DELETE REVIEWS");
    // console.log(re1);
    // console.log(re1);
    // console.log(re2);
    // console.log(re2);
    res.redirect(`/listings/${id}`);
}));


module.exports = router;