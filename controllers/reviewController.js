const reviewModel = require("../models/review-model");
const utilities = require("../utilities/")
const reviewCont = {}

reviewCont.buildReviews = async function (req, res, next) {
  try {
    const car_id = req.params.inv_id;
    console.log(`Car data requested: ${car_id}`);

    const data = await reviewModel.getReviewsByCar(car_id);
    console.log(data);
    const nav = utilities.getNav()
    if (!data || data.length === 0) {
      return res.status(404).render("error", {
        title: "Error 404",
        message: "No reviews found for this car.",
        status: 404,
        errors: null,
        nav,
    });
}
    res.render("reviews", {
        title: "Customer Reviews",
        reviews: data,   
        nav,
        errors: null
    });

  } catch (error) {
    console.error("Error building reviews:", error);
    next(error);
  }
};

module.exports = reviewCont