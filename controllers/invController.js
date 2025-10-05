const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  console.log(data);
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
  const classificationSelect = await utilities.buildClassificationList()
  const grid = await utilities.buildClassificationGrid([])
  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null,
    classificationSelect,
    grid,
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
  let options = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
     title: "Add Inventory",
     nav,
     errors: null,
     options,
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

invCont.BuildClassificationOptions = async function (req, res, next) {
  let options = await utilities.buildClassificationList()
  res.send(options)
}

invCont.registerInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const regResult = await invModel.registerInventory(
    inv_make,
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id
  )
  if (regResult) {
    req.flash(
      "notice", 
      `Congratulations, you've added the inventory item ${inv_make} ${inv_model}.`)
    return res.redirect("/inventory")
  } else {
    req.flash("notice", "Oops, something went wrong with adding the inventory item.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      options: await utilities.buildClassificationList(),
    })
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)

    if (invData.rows && invData.rows.length > 0) {
      return res.json(invData.rows) 
    } else {
      return res.status(404).json({ message: "No inventory found for this classification." })
    }

  } catch (error) {
    console.error("getInventoryJSON error:", error)
    next(error)
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */

invCont.getInventoryJSON = async (req,res,next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */

invCont.editInventoryView = async function (req,res,next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  let options = await utilities.buildClassificationList()
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title : `Edit ${itemName}`,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    options,
  })
}


invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { 
    inv_id, 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id 
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_year, 
    inv_miles, 
    inv_color, 
    classification_id
  )
  const itemName = `${inv_make} ${inv_model}`
  const classificationSelect = await utilities.buildClassificationList(classification_id)
  if (updateResult) {
    req.flash(
      "notice", 
      `The inventory item ${itemName} has been updated successfully.`)
    return res.redirect("/inventory")
  } else {
    req.flash("notice", "Oops, something went wrong with updating the inventory item.")
    res.status(501).render("inventory/edit-inventory", {
      title: `Edit ${itemName}`,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      options: await utilities.buildClassificationList(),
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
  }
}

invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  res.render("./inventory/delete-inventory", {
    title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
    nav,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    errors: null,
  })
}

invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { 
    inv_id, 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_price, 
  } = req.body

  const deleteResult = await invModel.deleteInventory(inv_id)
  const itemName = `${inv_make} ${inv_model}`
  if (deleteResult) {
    req.flash(
      "notice", 
      `The inventory item ${itemName} has been deleted successfully.`)
    return res.redirect("/inventory")
  } else {
    req.flash("notice", "Oops, something went wrong with deleting the inventory item.")
    res.status(501).render("inventory/delete-inventory", {
      title: `Delete ${itemName}`,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    })
  }
}


module.exports = invCont;
