const placeList = require("../models/wonderLust.js");
const Review = require("../models/review.js");

module.exports.reviewCreate = async(req,res)=>{
    const {id}=req.params;
    let listing=await placeList.findById(id);
    let newReview = new Review(req.body.reviews);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Added Successfully");
    return res.redirect(`/listings/${id}`);
}
module.exports.destroyReview = async (req,res) => {
    let id = req.params.id;
    let reviewId  = req.params.reviewsId;
    let re1 = await placeList.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    let re2 = await Review.findByIdAndDelete(reviewId);
    console.log(re1,re2)
    req.flash("success","Review deleted Successfully");
    res.redirect(`/listings/${id}`);
}