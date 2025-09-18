/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const inventoryRoutes = require("./routes/inventoryRoutes")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout","./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)
//index Route
app.get("/", baseController.BuildHome)
app.use("/inv", inventoryRoutes)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = 5500
const host = 'localhost'

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
