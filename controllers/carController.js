const carModel = require("../models/car-model");
const utilities = require("../utilities/");
const carCont = {}

carCont.buildCarDetails = async function(req,res,next) {
    try {
        const car_id = req.params.inv_id
        const data = await carModel.getCarDetails(car_id)
        if (data.length === 0) {
            return res.status(404).setd("Car not found")
        }
        const CarHTML = await utilities.buildcarDetails(data[0])
        res.render("car/details", {
            title: `${data[0].inv_make} ${data[0].inv_model}`,
            CarHTML
        })
    } catch (err) {
        next(err)
    }

}