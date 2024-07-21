// Needed Resources
const express = require("express");
const router = new express.Router();
const reviewsController = require("../controllers/reviewsController");
const utilities = require("../utilities/index");
// const invValidate = require("../utilities/inventory-validation"); Change to reviewws validate

// Route to handle the deletion view
router.get(
  "/delete/:review_id",
  utilities.handleErrors(reviewsController.buildDeleteReviewView)
);

// Add the delete review action route
router.post(
  "/delete/:review_id",
  utilities.checkJWTToken,
  utilities.handleErrors(reviewsController.deleteReview)
);

// Route to handle the deletion view
router.get(
  "/edit/:review_id",
  utilities.handleErrors(reviewsController.buildEditReviewView)
);

// Add the delete review action route
router.post(
  "/update/:review_id",
  utilities.checkJWTToken,
  utilities.handleErrors(reviewsController.editReview)
);

module.exports = router;
