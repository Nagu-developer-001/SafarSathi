const express = require("express");
const router = express.Router();
const {UniqueUrl} = require("../AuthenticLogin.js");
let otherCategoryController = require("../controllers/otherCategory.js");
router.get("/listings/FAQ",UniqueUrl,otherCategoryController.renderFAQ);
router.get("/listings/help",UniqueUrl,otherCategoryController.renderHelp);

module.exports = router;