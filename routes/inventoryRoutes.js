const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const validate = require("../utilities/inventory-validation")
const vehicleValidate = require("../utilities/vehicle-validation")

router.get("/", invController.buildManagement);
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/add-classification", invController.buildAddClassification);
router.post("/add-classification", validate.addClassification(), invController.addClassification);
router.get("/add-inventory", invController.buildAddInventory);
router.post("/add-inventory", vehicleValidate.registerInventory(), invController.registerInventory);


module.exports = router