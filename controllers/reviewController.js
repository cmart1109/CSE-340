const reviewModel = require("../models/review-model");
const utilities = require("../utilities/")
const reviewCont = {}

reviewCont.buildReviews = async function (req,res,next) {
    try {
        const car_id = req.params.id;
        console.log(`Car data requested: ${car_id}`)
        const data = await reviewModel.getReviewsByCar(car_id)
        console.log(data)
        if (!data) {
            return res.status(404).render("error", {
                title: "Error 404",
                message: "Car not found",
                status: 404,
                errors:null,
            });
        }
        const reviewsArray = document.createElement("div");
        reviewsArray.classList = "reviews-container";
        data.forEach(review => {
         const review = document.createElement("div")
         review.classList = "review-card"
         const userName = document.createElement("h3")
         userName.textContent = review.accound_id;
         
        });
    } catch {

    }
};
