const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController.js")
const regValidate = require("../utilities/account-validation")

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.loginManagement));
router.get("/edit", utilities.checkLogin, utilities.handleErrors(accountController.editAccountView));
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister)
router.post("/register", 
            regValidate.registrationRules(), 
            regValidate.checkRegData,  
            utilities.handleErrors(accountController.registerAccount)
        )
router.post(
  "/login", 
  accountController.accountLogin,
  regValidate.loginRules(),
  regValidate.checkLoginData,
)
router.get("/logout", accountController.accountLogout);

module.exports = router

