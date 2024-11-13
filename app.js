const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8080;
const placeList = require("./models/wonderLust.js");
const review = require("./models/review.js");
const methodOverload = require("method-override");
const ejsMate = require("ejs-mate");
//TODO use ejs-locals for all ejs templates:
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverload("_method"));
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErr = require("./utils/ExpressErr.js");
const validateUserData = require("./joiSchema.js");
console.log(ExpressErr);
main().then((res)=>{
    console.log("Successfully Connected to DataBase!");
}).catch((err)=>{
    console.log(err.errors);
});
const validateData = (req,res,next)=>{
    console.log(req.body);
    console.log("ERROR IS OCCURING");
    let palceListsErr = validateUserData.validate(req.body);//TODO ANOTHER WAY TO GET THE MULTIPLE DATA FROM FORM ...
    console.log(validateUserData.validate(req.body));
    if(palceListsErr.error){
        throw new ExpressErr(500,error);
    }else{
        next();
    }
}
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderLust");
}
app.use("/api",(req,res,next)=>{
    console.log("This is middleware !!! for/here we do athentication");
    next();
});
//TODO CREATE ROUTE
app.get("/",(req,res)=>{
    res.send("GET is working!!!... .. .");
});
//todo TESTING ROUTE
app.get("/api/TestListings",async(req,res)=>{
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
app.get("/Listings",wrapAsync(async(req,res)=>{
    let allListing = await placeList.find({});
    console.log("allListing");
    res.render("listings/index.ejs",{allListing});
}));
//TODO NEW ROUTE
app.get("/Listings/new",wrapAsync((req,res)=>{
    res.render("listings/newForm.ejs");
}));
//TODO SHOW ROUTE
app.get("/Listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let content = await placeList.findById(id).populate("reviews");
    console.log(content);
    //
    res.render("listings/show.ejs",{content});
}));

//TODO CREATE ROUTE
app.post("/Listings",validateData,wrapAsync(async(req,res)=>{
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
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let content = await placeList.findById(id);
    console.log(content);
    res.render("listings/edit.ejs",{content});
}));
//TODO UPDATE ROUTE
app.put("/listings/:id",validateData,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await placeList.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect("/listings");
}));
//TODO DELETE ROUTE
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deleteEle = await placeList.findByIdAndDelete(id);
    res.redirect("/listings");
}));
//TODO POSTING REVIEWS
app.post("/listings/:id/reviews",async (req,res)=>{
    console.log("LOGGING POST REVIEW",req.body);
    //res.send("LOGGING POST REVIEW");

    let id = req.params.id;
    console.log(id);


    let review1 = new review(req.body.reviews);
    await review1.save();

    let placeReview = await placeList.findById(id);
    console.log(placeReview);
    placeReview.reviews.push(review1);
    await placeReview.save();

    res.redirect(`/listings/${id}`);
});


function validateErr(err){
    console.log(err);
    return err;
}
function castError(err){
    console.log(err);
    return err;
}
//TODO ERROR HANDILNG ROUTE
app.use((err,req,res,next)=>{
    if(err.name == "ValidationError"){
        err = validateErr(err);
        next(err);
    }
    if(err.name == "CastError"){
        err = castError(err);
        next(err);
    }
});
//TODO PAGE NOT FOUND   USE BOOTSRAP ALERT COMPONENT
app.all("*",(req,res,next)=>{
    console.log("err");
    next(new ExpressErr(404,"PAGE NOT FOUND!!"));
});
app.use((err,req,res,next)=>{
    console.log("hello 1");
    console.log(err)
    let {statusCode,message} = err;
    //const {errors} ={statusCode,message};
    //res.render("listings/error.ejs",{errors});
    res.render("./listings/error.ejs",{message});
});
app.listen(port,(req,res)=>{
    console.log(`The server has been Started at localhost // - ${port}`);
});