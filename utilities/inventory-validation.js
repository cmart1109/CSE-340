const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")

validate.addClassification = () => {
    return [
        body("classification_name")
            .trim()
            .isAlpha()
            .withMessage("Classification has to be just alphabetical characters.")
            .custom(async (value) => {
                const existing = await inventoryModel.getClassificationByName(value)
                if (existing) {
                    throw new Error("Classification name already exists.")
                }
            }),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                req.flash("errors", errors.array())
                return res.redirect("./")
            }
            next()
        },
    ]
}
