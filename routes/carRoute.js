const express = require("express")
const router = new express.Router()
const carController = require("../controllers/carController")

router.get("/detail/:inv_id", carController.buildCarDetails)
module.exports = router