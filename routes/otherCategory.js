const express = require("express");
const router = express.Router({mergeParams:true});
const placeList = require("../models/wonderLust.js");
const {UniqueUrl} = require("../AuthenticLogin.js");
let otherCategoryController = require("../controllers/otherCategory.js");

router.get("/listings/FAQ",UniqueUrl,otherCategoryController.renderFAQ);
router.get("/listings/help",UniqueUrl,otherCategoryController.renderHelp);
router.get("/search",async(req,res)=>{
    let {searchQuery} =  req.query;
    let pricers = searchQuery.match(/\d+/g);
    if(searchQuery){
        req.session.searchQuery = searchQuery;
        // if(pricers){
        //     console.log(pricers);
        // let maxPrice = null;
        // let minPrice =  Math. pow(10, 1000); 
        // for(price of pricers){
        //     if(maxPrice<price){
        //         maxPrice=price;
        //     }
        // }
        // for(prices of pricers){
        //     if(minPrice>prices){
        //         minPrice=prices;
        //     }
        // }
        // console.log(maxPrice,minPrice);
        // maxPrice = parseInt(maxPrice);
        // minPrice = parseInt(minPrice);
        // let allListing = await placeList.find({$or:[{title:{  $regex: searchQuery,$options: 'i' }},
        //     {price:{$gte:maxPrice}},{price:{$lte:minPrice}}
        //     ]});
        // console.log(allListing);
        // res.render("listings/index.ejs",{allListing});
        // }
        let allListing = await placeList.find({$or:[{title:{  $regex: searchQuery,$options: 'i' }}]});
        console.log(`searching for ${searchQuery}`);
        res.render("listings/searching.ejs",{allListing});
    }
});
router.get("/settings",(req,res)=>{
    res.send("<h2>The Settings!</h2>");

});
router.get("/priceRange",async(req,res)=>{
    let searchQuery = req.session.searchQuery;
    let prices = req.query.priceRangeText.match(/\d+/g);
    console.log(prices);
    // prices = parseInt(prices);
    let maxPrice = null;
    let minPrice = Math.pow(10,1000);
    for(let price of prices){
        console.log(parseInt(price));
        if(maxPrice<parseInt(price)){
            maxPrice = price;
        }
    }
    for(let price of prices){
        if(minPrice>price){
            minPrice = price;
        }
    }
    let catFiler = req.session.catFiler;
    console.log(catFiler);
    console.log("min price - ",minPrice,"max price - ",maxPrice);
    let allListing = [];
    if(searchQuery){
        let perticular_list = await placeList.find({title:{  $regex: searchQuery,$options: 'i' }});
        for(let i=0;i<perticular_list.length;i++){
            if(perticular_list[i].price>=minPrice && perticular_list[i].price<=maxPrice){
                //console.log(perticular_list[i].image.url);
                allListing.push(perticular_list[i]);
            }
        }
    }else{
        console.log(catFiler,minPrice,maxPrice);
        let perticular_list = await placeList.find({category:catFiler,price:{$gte:parseInt(minPrice),$lte:parseInt(maxPrice)}});
        console.log(perticular_list);
        allListing = perticular_list;
    }
    
    
    // for(list of perticular_list){
    //     //console.log(list.price);
        
    // }
    
    //console.log(allListing);
    //for(list of allListing){
       // console.log(list);
    //}
    res.render("listings/searching.ejs",{allListing});
});

module.exports = router;