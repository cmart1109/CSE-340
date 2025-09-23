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
      '<a href="/inv/type/' +
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



Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)





module.exports = Util