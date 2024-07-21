const revModel = require("../models/reviews-model");
const invModel = require("../models/inventory-model.js");
const utilities = require("../utilities/");
const revCont = {};
/* ****************************************
 *  Submit Review
 * *************************************** */
revCont.submitReview = async function (req, res, next) {
  const { review_text } = req.body;
  const inv_id = req.params.id;
  const accountData = res.locals.accountData;
  const account_id = accountData.account_id;
  const subResult = await revModel.insertReviewById(
    review_text,
    inv_id,
    account_id
  );

  if (subResult) {
    req.flash("notice", "Review submitted successfully.");
    console.log("Review submitted successfullly");
    res.status(201).redirect(`../detail/${inv_id}`);
  } else {
    req.flash("notice", "Sorry, review submission failed.");
    console.log("Review submission failed");
    res.status(500).redirect(`../detail/${inv_id}`);
  }
};

/* ***************************
 *  Build delete reviews view
 * ************************** */
revCont.buildDeleteReviewView = async function (req, res, next) {
  try {
    const review_id = req.params.review_id;
    const inv_id = req.query.inv_id;
    const inventoryData = await invModel.getItemById(inv_id);
    const deleteReviewForm = await utilities.buildDeleteReviewForm(review_id);
    let nav = await utilities.getNav();

    res.render("./reviews/delete", {
      title: `Delete Review for ${inventoryData.inv_make} ${inventoryData.inv_model}`,
      nav,
      deleteReviewForm,
      inv_id,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process delete review
 * ************************** */
revCont.deleteReview = async function (req, res, next) {
  try {
    const review_id = req.params.review_id;

    await revModel.deleteReview(review_id);

    req.flash("success", "Review Successfully Deleted");
    res.redirect("/account");
  } catch (error) {
    req.flash("error", "Sorry there was an error deleting the review.");
    console.error("deleteReview error: " + error.message);
    next(error);
  }
};

/* ***************************
 *  Build edit reviews view
 * ************************** */
revCont.buildEditReviewView = async function (req, res, next) {
  try {
    const review_id = req.params.review_id;
    const inv_id = req.query.inv_id;
    const inventoryData = await invModel.getItemById(inv_id);
    const editReviewForm = await utilities.buildEditReviewForm(review_id);
    let nav = await utilities.getNav();

    res.render("./reviews/edit", {
      title: `Edit Review for ${inventoryData.inv_make} ${inventoryData.inv_model}`,
      nav,
      editReviewForm,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process edit review
 * ************************** */
revCont.editReview = async function (req, res, next) {
  try {
    const review_id = req.params.review_id;
    const { review_text } = req.body;

    if (!review_text) {
      req.flash("error", "Review text is required.");
      return res.redirect(`/reviews/edit/${review_id}`);
    }

    await revModel.editReview(review_id, review_text);

    req.flash("success", "Review Successfully Edited");
    res.redirect("/account");
  } catch (error) {
    req.flash("error", "Sorry there was an error editing the review.");
    console.error("editReview error: " + error.message);
    next(error);
  }
};

module.exports = revCont;
