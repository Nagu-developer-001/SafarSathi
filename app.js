const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8080;

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
const ExpressErr = require("./utils/ExpressErr.js");

let listing = require("./routes/listing.js");
let reviews = require("./routes/review.js");

app.use("/",reviews);
app.use("/listings",listing);




// const review = require("./models/review.js");
console.log(ExpressErr);
main().then((res)=>{
    console.log("Successfully Connected to DataBase!");
}).catch((err)=>{
    console.log(err.errors);
});


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


function validateErr(err){
    console.log(err);
    return err;
}
function castError(err){
    console.log(err);
    return err;
}
//TODO ERROR HANDILNG ROUTE
//TODO PAGE NOT FOUND   USE BOOTSRAP ALERT COMPONENT
app.all("*",(req,res,next)=>{
    console.log("err");
    next(new ExpressErr(404,"PAGE NOT FOUND!!"));
});
app.use((err, req, res, next) => {
    if (err.name === "ValidationError") {
        err = validateErr(err); // Assuming validateErr transforms the error appropriately
    } else if (err.name === "CastError") {
        err = castError(err); // Assuming castError transforms the error appropriately
    }

    // Set a default error status if one isn’t already set
    err.status = err.status || 500;

    // Render the error page with the message
    res.status(err.status).render("./listings/error.ejs", { message: err.message });
});

app.listen(port,(req,res)=>{
    console.log(`The server has been Started at localhost // - ${port}`);
});