const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");

const placeList = require("../models/wonderLust.js");
const Review = require("../models/review.js");

const ExpressErr = require("../utils/ExpressErr.js");

const {validateUserRating} = require("../joiSchema.js");

const wrapAsync = require("../utils/wrapAsync.js");
const {isLogined} = require("../AuthenticLogin.js");


const validateRating = (req,res,next)=>{
    let review = req.body;
    console.log(review.parseInt(rating))
    console.log(req.body);
    let {err} = validateUserRating.validate(req.body);//TODO ANOTHER WAY TO GET THE MULTIPLE DATA FROM FORM ...
    console.log(err,"------");
    console.log(err,"!!!!!!");
    if(!err){
        next();
    }throw new ExpressErr(404,err);
    
}

//TODO POSTING REVIEWS

router.post("/listings/:id/reviews",validateRating,wrapAsync(async(req,res)=>{
    let {rating,comment}=req.body;
    const {id}=req.params;
    let listing=await placeList.findById(id);
    let newReview=new Review(req.body.reviews);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Added Successfully");

    res.redirect(`/listings/${id}`);

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