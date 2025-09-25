/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const bodyParser = require("body-parser")
const session = require("express-session")
const pool = require("./database/")
const express = require("express")
const inventoryRoutes = require("./routes/inventoryRoutes")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")
const carRoutes = require("./routes/carRoute")
const accountRoute = require("./routes/accountRoute")
/* ***********************
 * View Engine and Templates
 *************************/
/*
Middleware
*/
app.use(session({
    store: new (require('connect-pg-simple')(session)) ({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'SessionId' 
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req,res,next) {
  res.locals.messages = require('express-messages')(req,res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout","./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)
//index Route
app.get("/", utilities.handleErrors(baseController.BuildHome))
app.use("/inv", inventoryRoutes)
app.use("/account", accountRoute)
app.use("/car", carRoutes)
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})




app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/


app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

