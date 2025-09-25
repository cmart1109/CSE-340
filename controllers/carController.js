const carModel = require("../models/car-model");
const utilities = require("../utilities/");
const carCont = {}

carCont.buildCarDetails = async function(req,res,next) {
    try {
        const car_id = req.params.inv_id;
        console.log("Car ID from request params:", car_id);

        const data = await carModel.getCarDetails(car_id);
        if (!data) {
             return res.status(404).render("error", {
        title: "Error 404",
        message: "Car not found",
        status: 404,
        errors: null,
    });
        }

        let nav = await utilities.getNav();
        const carHtml = await utilities.buildcarDetails(data);

        res.render("inventory/detail", {
            title: `${data.inv_make} ${data.inv_model}`,
            carHtml,
            nav,
            errors: null,
        });
    } catch (error) {
        next(error);
    }
}
module.exports = carCont;