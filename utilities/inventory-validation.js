const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")

validate.addClassification = () => {
    return [
        body("classification_name")
            .trim()
            .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
            .withMessage("Classification has to be just alphabetical characters.")
            .custom(async (value) => {
                const existing = await inventoryModel.getClassificationByName(value)
                if (existing) {
                    throw new Error("Classification name already exists.")
                }
            }),
        async (req, res, next) => {
            const errors = validationResult(req)
            let nav = await utilities.getNav()
            if (!errors.isEmpty()) {
                return res.status(400).render("./inventory/add-classification", {
                    title: "Add Classification",
                    nav,
                    errors,
                    classification_name: req.body.classification_name,
                })
            }
            next()
        },
    ]
}


module.exports = validate