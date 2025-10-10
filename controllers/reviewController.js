const reviewModel = require("../models/review-model");
const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const reviewCont = {}

reviewCont.buildReviews = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    console.log(`Carid: ${inv_id}`)
    console.log(`Car data requested: ${inv_id}`);
    const accountData = res.locals.accountData
    console.log(accountData)
    const data = await reviewModel.getReviewsByCar(inv_id);
    console.log(data);
    let nav = await utilities.getNav()
    if (!data || data.length === 0) {
      return res.render("./inventory/reviews", {
        title: "Customer Reviews",
        nav,
        reviews: [],
        errors: null,
        inv_id,
        accountData,
    });
    }
    res.render("./inventory/reviews", {
        title: "Customer Reviews",
        reviews: data,   
        nav,
        errors: null,
        inv_id,
        accountData,
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
    console.log(inv_id, account_id, rating, comment)
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
        res.status(501).render(`./inventory/reviews`, {
          title: "Reviews",
          nav,
          errors:null, 
        })
      }
    } catch (error) {
      req.flash("notice", "An Error occurred while adding the comment")
      res.status(500).render("./inventory/reviews", {
        title:"review",
        nav,
        errors:null,
      })
    }
}

module.exports = reviewCont