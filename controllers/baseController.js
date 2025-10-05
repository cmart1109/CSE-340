const utilities = require("../utilities/")
const baseController = {}

baseController.BuildHome = async function(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("index", {
      title: "Home",
      nav,
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = baseController
