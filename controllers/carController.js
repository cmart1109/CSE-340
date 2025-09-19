const carModel = require("../models/car-model");
const utilities = require("../utilities/");
const carCont = {}

carCont.buildCarDetails = async function(req,res,next) {
    try {
        const car_id = req.params.inv_id
        const data = await carModel.getCarDetails(car_id)
        if (data.length === 0) {
            return res.status(404).send("Car not found")
        }
        const carHtml = await utilities.buildcarDetails(data[0])
        res.render("inventory/details", {
            title: `${data[0].inv_make} ${data[0].inv_model}`,
            carHtml
        })
    } catch (err) {
        next(err)
    }

}

module.exports = carCont;