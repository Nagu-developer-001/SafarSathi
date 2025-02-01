const express = require("express");
const router = express.Router({mergeParams:true});
const mongoose = require("mongoose");
const placeList = require("../models/wonderLust.js");
const Review = require("../models/review.js");

const ExpressErr = require("../utils/ExpressErr.js");

const isvalid = (req,res,next)=>{
    console.log("requesting");
    next();
}

const wrapAsync = require("../utils/wrapAsync.js");
const {validateRating,isLogined,reviewOwner} = require("../AuthenticLogin.js");

//TODO POSTING REVIEWS

router.post("/listings/:id/reviews",isLogined,validateRating,wrapAsync(reviewCreate));


//TODO DELETE REQUEST
router.delete("/listings/:id/reviews/:reviewsId",isLogined,reviewOwner,wrapAsync(destroyReview));


module.exports = router;