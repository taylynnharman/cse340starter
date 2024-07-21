// Needed Resources
const express = require("express");
const router = new express.Router();
const reviewsController = require("../controllers/reviewsController");
const utilities = require("../utilities/index");
// const invValidate = require("../utilities/inventory-validation"); Change to reviewws validate

// Add the delete review view route
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

module.exports = router;
