const express = require("express")
const router = new express.Router()
import Util from require("../utilities/");
import acctController from "../controllers/"

router.get("/account", acctController);
module.exports = router