const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

router.get("/", invController.buildManagement);
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/add-classification", invController.buildAddClassification);
module.exports = router