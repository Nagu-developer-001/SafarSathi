const express = require("express");
const router = express.Router();
const placeList = require("../models/wonderLust.js");
const {UniqueUrl} = require("../AuthenticLogin.js");
let otherCategoryController = require("../controllers/otherCategory.js");
router.get("/listings/FAQ",UniqueUrl,otherCategoryController.renderFAQ);
router.get("/listings/help",UniqueUrl,otherCategoryController.renderHelp);
router.get("/search",async(req,res)=>{
    let {searchQuery} =  req.query;
    let pricers = searchQuery.match(/\d+/g);
    if(searchQuery){
        if(pricers){
            console.log(pricers);
        let maxPrice = null;
        let minPrice =  Math. pow(10, 1000); 
        for(price of pricers){
            if(maxPrice<price){
                maxPrice=price;
            }
        }
        for(prices of pricers){
            if(minPrice>prices){
                minPrice=prices;
            }
        }
        console.log(maxPrice,minPrice);
        maxPrice = parseInt(maxPrice);
        minPrice = parseInt(minPrice);
        let allListing = await placeList.find({$or:[{title:{  $regex: searchQuery,$options: 'i' }},
            {price:{$gte:maxPrice}},{price:{$lte:minPrice}}
            ]});
        console.log(allListing);
        res.render("listings/index.ejs",{allListing});
        }
        let allListing = await placeList.find({$or:[{title:{  $regex: searchQuery,$options: 'i' }}]});
        console.log(`searching for ${searchQuery}`);
        res.render("listings/searching.ejs",{allListing});
    }
});
module.exports = router;