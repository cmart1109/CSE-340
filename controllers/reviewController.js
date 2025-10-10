const reviewModel = require("../models/review-model");
const utilities = require("../utilities/")
const reviewCont = {}

reviewCont.buildReviews = async function (req, res, next) {
  try {
    const car_id = req.params.inv_id;
    console.log(`Car data requested: ${car_id}`);

    const data = await reviewModel.getReviewsByCar(car_id);
    console.log(data);
    let nav = await utilities.getNav()
    if (!data || data.length === 0) {
      return res.render("./inventory/reviews", {
        title: "Customer Reviews",
        nav,
        reviews: [],
        errors: null,
    });
    }
    res.render("./inventory/reviews", {
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

reviewCont.registerReview = async function (req,res,next) 
{
    let nav = await utilities.getNav();
    const {inv_id, account_id, rating, comment} = req.body
    try {
      const reviewResult = await reviewModel.addReview(inv_id, account_id, rating, comment)
      
      if (reviewResult) {
        req.flash(
          "notice",
          `Congratulations, your review is now submitted`
        )
        return res.redirect(`/car/detail/${inv_id}`)
      } else {
        req.flash("notice", "Oops, something went wrong with adding the comment")
        res.status(501).render(`./reviews`, {
          title: "Reviews",
          nav,
          errors:null, 
        })
      }
    } catch (error) {
      req.flash("notice", "An Error occurred while adding the comment")
      res.status(500).render("./reviews", {
        title:"review",
        nav,
        errors:null,
      })
    }
}

module.exports = reviewCont