const bcrypt = require("bcryptjs")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const acctCount = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()


async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

async function buildRegister(req,res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}



async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email, account_password} = req.body
    let hashedPassword
    try {
      // regular password and cost 
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", "Sorry, there was an error processing the registration.")
      res.status(500).render("account/register", {
        title: "Register",
        nav,
        errors: null,
      })
    }
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
    if (regResult) {
      console.log(regResult)
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in`
      )
      res.status(201).render("account/login", {
        title:"Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  console.log(accountData)
  if (!accountData) {
    console.log('No account found')
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      console.log('Password does not match')
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "  ",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function loginManagement(req,res,next) {
  let nav = await utilities.getNav();
  res.render("account/logged", {
    title: "Profile Homepage",
    nav,
    errors:null,
  })
}

async function accountLogout(req, res, next) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/")
}


async function editAccountView(req, res, next) {
  let nav = await utilities.getNav();
  const accountData = await accountModel.getAccountById(res.locals.accountData.account_id);
  console.log(accountData);
  res.render("account/edit", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  });
}

async function editAccount(req, res, next) {
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  const account_id = res.locals.accountData.account_id
  let hashedPassword = null

  try {
    if (account_password && account_password.trim() !== "") {
      hashedPassword = await bcrypt.hash(account_password, 10)
    }

    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (updateResult) {
      req.flash("notice", "Your account has been updated.")
      return res.status(200).redirect("/account/")
    } else {
      req.flash("notice", "Sorry, the update failed.")
      console.log("Update failed:", updateResult)
      const accountData = await accountModel.getAccountById(account_id)
      return res.status(501).render("account/edit", {
        title: "Edit Account",
        nav,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
      })
    }
  } catch (error) {
    console.error("Error in editAccount:", error)
    req.flash("notice", "Sorry, there was an error processing the update.")
    const accountData = await accountModel.getAccountById(account_id)
    return res.status(500).render("account/edit", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, loginManagement, accountLogout, editAccountView, editAccount }