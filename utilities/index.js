const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model")
const carModel = require("../models/car-model")
const Util = {}

Util.getNav = async function (req,res,next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
      '<a href="/inventory/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
      grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../car/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../car/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
    } else {
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  
    }
    console.log("classifcation Grid Obtained");
    return grid
}


Util.buildcarDetails = async function (data) {
  let carDetailsContainer = `
    <section id="car-box">
      <div id="car-image">
        <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors" />
      </div>
      <div id="car-details">
        <h3 class="price">$${new Intl.NumberFormat('en-US').format(data.inv_price)}</h3>
        <p><strong>Year:</strong> ${new Intl.NumberFormat('en-US').format(data.inv_year)}</p>
        <p><strong>Color:</strong> ${data.inv_color}</p>
        <p><strong>Description:</strong> ${data.inv_description}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(data.inv_miles)} miles</p>
        <button id="add-to-cart" onclick="addToCart(${data.inv_id})">Add to Cart</button>
      </div>
    </section>
  `;
  return carDetailsContainer;
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList = '<select name="classification_id" id="classificationList">'
  classificationList += '<option value="" disabled selected>Choose a Classification</option>' // fixed here
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */

Util.checkJWTToken = (req, res, next) => {
  res.locals.loggedin = false;  
  res.locals.accountData = null;
  if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please Log in.")
    return res.redirect("/account/login")
  }
}

Util.getAccountInfo = async (req, res, next) => {
  try {
    if (res.locals.loggedin && res.locals.accountData) {
      const accountId = res.locals.accountData.account_id
      const account = await accountModel.getAccountById(accountId)
      res.locals.userData = account || null
    }
  } catch (error) {
    console.error("getAccountInfo error: ", error)
  }
  next()
}

Util.checkAccountType = (req, res, next) => {
  try {
  const requiredRoles = ['Employee', 'Admin'];
  if (!req.cookies?.jwt) {
    req.flash("notice", "Please login to access this page.")
    return res.redirect("/account/login")
  }  
  const payload = jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET
  )
  if (!requiredRoles.includes(payload.account_type)) {
    req.flash("notice", "You do not have permission to access this page.")
    return res.redirect("/account/login")
  }

  res.locals.accountData = payload
  res.locals.loggedin = 1
  next()
  } catch (error) {
    console.error("checkAccountType error: ", error)
    req.flash("notice", "Please login to access this page.")
    return res.redirect("/account/login")
  }
}



module.exports = Util;