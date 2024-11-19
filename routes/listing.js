const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const placeList = require("../models/wonderLust.js");
const {validateUserData} = require("../joiSchema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErr = require("../utils/ExpressErr.js");




const validateData = (req,res,next)=>{
    console.log(req.body);
    console.log("ERROR IS OCCURING");
    let {err} = validateUserData.validate(req.body);//TODO ANOTHER WAY TO GET THE MULTIPLE DATA FROM FORM ...
    console.log(err);
    if(err){
        throw new ExpressErr(500,err); 
    }else{
        next();
    }
}


//todo TESTING ROUTE
router.get("/api/TestListings",async(req,res)=>{
    place = [{
                title: "Cozy Beachfront Cottage111",
                description:
                    "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
                image: {
                    filename: "listingimage",
                    url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        },
        price: 1500,
        location: "Malibu",
        country: "United States",
        }]
        let x = await placeList.insertMany(place);
        console.log(x);
});
//TODO INDEX ROUTE
router.get("/",wrapAsync(async(req,res)=>{
    let allListing = await placeList.find({});
    console.log("allListing");
    res.render("listings/index.ejs",{allListing});
}));
//TODO NEW ROUTE
router.get("/new",wrapAsync((req,res)=>{
    res.render("listings/newForm.ejs");
}));
//TODO SHOW ROUTE
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let content = await placeList.findById(id).populate("reviews");
    //console.log(content);
    //
    res.render("listings/show.ejs",{content});
}));

//TODO CREATE ROUTE
router.post("/",validateData,wrapAsync(async(req,res)=>{
    // if(!req.body.Listing){
    //     next( new ExpressErr(402,"INTERNAL SERVER ERROR"));
    // }
    console.log("hello");
    let placeLists = req.body.Listing;
    let placeAdd = await placeList.insertMany(placeLists);
    console.log(placeAdd);
    res.redirect("/listings");
}));
//TODO EDIT ROUTE
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let content = await placeList.findById(id);
    console.log(content);
    res.render("listings/edit.ejs",{content});
}));
//TODO UPDATE ROUTE
router.put("/:id",validateData,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await placeList.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect("/listings");
}));
//TODO DELETE ROUTE
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deleteEle = await placeList.findByIdAndDelete(id);
    res.redirect("/listings");
}));



module.exports = router;