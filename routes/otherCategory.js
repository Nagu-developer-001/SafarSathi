const express = require("express");
const router = express.Router();


router.get("/FAQ",(req,res)=>{
    res.render("./listings/faq.ejs");
});

module.exports = router;