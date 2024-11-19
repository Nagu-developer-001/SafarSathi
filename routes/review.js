const express = require("express");
const router = express.Router({mergeParams:true});
const mongoose = require("mongoose");

const placeList = require("../models/wonderLust.js");
const Review = require("../models/review.js");

const ExpressErr = require("../utils/ExpressErr.js");

const {validateUserRating} = require("../joiSchema.js");

const wrapAsync = require("../utils/wrapAsync.js");


const validateRating = (req,res,next)=>{
    let {err} = validateUserRating.validate(req.body);//TODO ANOTHER WAY TO GET THE MULTIPLE DATA FROM FORM ...
    console.log(err);
    if(err){
        throw new ExpressErr(500,err); 
    }else{
        next();
    }
}

//TODO POSTING REVIEWS
router.post("/listings/:id/reviews",validateRating,wrapAsync(async (req,res)=>{
    console.log("LOGGING POST REVIEW",req.body);
    //res.send("LOGGING POST REVIEW");

    let id = req.params;
    console.log(id);


    let review1 = new Review(req.body.reviews);
    await review1.save();

    let placeReview = await placeList.findById(id);
    //console.log(placeReview);
    placeReview.reviews.push(review1);
    await placeReview.save();

    res.redirect(`/listings/${placeReview._id}`);
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
    // console.log("TRYING TO DELETE REVIEWS");
    // console.log(re1);
    // console.log(re1);
    // console.log(re2);
    // console.log(re2);
    res.redirect(`/listings/${id}`);
}));


module.exports = router;