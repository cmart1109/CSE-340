const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null,
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: null,
  })
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-inventory", {
     title: "Add Inventory",
     nav,
     errors: null,
   })
 }

invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  try {
    const classificationResult = await invModel.addClassification(classification_name)
    if (classificationResult) {
      req.flash(
        "notice",
        `Congratulations, you've added the classification ${classification_name}.`
      )
      return res.redirect("/inventory")
    } else {
      req.flash("notice", "Oops, something went wrong with adding the classification.")
      res.status(501).render("./inventory/add-classification", {
        title: "Add classification",
        nav,
        errors: null,
        classification_name,
      })
    }
  } catch (error) {
    req.flash("notice", "An error occurred while adding the classification.")
    res.status(500).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name,
    })
  }
}

module.exports = invCont;
