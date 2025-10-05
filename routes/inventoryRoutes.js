    const express = require("express")
    const router = new express.Router()
    const invController = require("../controllers/invController")
    const validate = require("../utilities/inventory-validation")
    const vehicleValidate = require("../utilities/vehicle-validation")
    const utilities = require("../utilities/")

    router.get("/", utilities.checkAccountType, invController.buildManagement);
    router.get("/type/:classificationId", invController.buildByClassificationId);
    router.get("/add-classification",  utilities.checkAccountType, invController.buildAddClassification);
    router.post("/add-classification", utilities.checkAccountType, validate.addClassification(), invController.addClassification);
    router.get("/add-inventory", utilities.checkAccountType, invController.buildAddInventory);
    router.post("/add-inventory", utilities.checkAccountType, vehicleValidate.registerInventory(), invController.registerInventory);
    router.get("/getInventory/:classification_id", invController.getInventoryJSON);
    router.get("/edit/:inv_id", utilities.checkAccountType, invController.editInventoryView);
    router.post("/edit-inventory", 
        vehicleValidate.checkUpdateData, 
        invController.updateInventory);
    router.get("/delete/:inv_id", utilities.checkAccountType, invController.deleteInventoryView);
    router.post("/delete-inventory", utilities.checkAccountType, invController.deleteInventory);



    module.exports = router