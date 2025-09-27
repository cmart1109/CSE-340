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
  })
}

   const classificationResult = await invModel.addClassification(
      classification_name
    )

    if (classificationResult) {
      console.log(classificationResult)
      req.flash(
        "notice",
        `Congratulations, you\'ve added the classification ${classification_name}.`
      )
      res.status(201).render("./inventory/management", {
        title:"Management",
        nav,
      })
    } else {
      req.flash("notice", "Oops, something went wrong with adding the classification.")
      res.status(501).render("./inventory/management", {
        title: "Management",
        nav,
      })
    }




module.exports = invCont
