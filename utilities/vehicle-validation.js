const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

validate.registerInventory = () => {
    return [
        // inv_make
        body("inv_make")
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage("Make must be between 2 and 100 characters")
            .custom(async (value, { req }) => {
                const exists = await invModel.findOne({ inv_make: value })
                if (exists) {
                    return Promise.reject("Make already exists")
                }
            }),
        // inv_model
        body("inv_model")
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage("Model must be between 2 and 100 characters"),
        // inv_year
        body("inv_year")
            .isNumeric()
            .withMessage("Year must be a number")
            .custom((value) => {
                if (value < 1886 || value > new Date().getFullYear()) {
                    throw new Error("Invalid year")
                }
                return true
            }),
        // inv_price
        body("inv_price")
            .isNumeric()
            .withMessage("Price must be a number")
            .custom((value) => {
                if (value <= 0) {
                    throw new Error("Invalid price")
                }
                return true
            }),
        // inv_mileage
        body("inv_mileage")
            .isNumeric()
            .withMessage("Mileage must be a number")
            .custom((value) => {
                if (value < 0) {
                    throw new Error("Invalid mileage")
                }
                return true
            })
    ]
}

validate.checkInvData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_price, inv_mileage } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            errors,
            nav,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
            inv_mileage,
        })
    }
    next()
}

validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_year, inv_price, inv_mileage } = req.body
    const itemName = `${inv_make} ${inv_model}`
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/edit-inventory", {
            title: `Edit ${itemName}`,
            errors,
            nav,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
            inv_mileage,
            inv_id
        })
    }
    next()
}

module.exports = validate