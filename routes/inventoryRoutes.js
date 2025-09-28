const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const validate = require("../utilities/inventory-validation")


router.get("/", invController.buildManagement);
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/add-classification", invController.buildAddClassification);
router.post("/add-classification", validate.addClassification(), invController.addClassification);

module.exports = router