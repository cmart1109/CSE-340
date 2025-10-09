const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const reviewCont = require("../controllers/reviewController")

router.get("/:inv_id", reviewCont.buildReviews)
module.exports = router