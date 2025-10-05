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
router.get("/getInventory/:classification_id", invController.getInventoryJSON);
router.get("/edit/:inv_id", invController.editInventoryView);
router.post("/edit-inventory", 
    vehicleValidate.checkUpdateData, 
    invController.updateInventory);
router.get("/delete/:inv_id", invController.deleteInventoryView);
router.post("/delete-inventory", invController.deleteInventory);


module.exports = router