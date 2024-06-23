// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory by detail view
router.get("/detail/:id", utilities.handleErrors(invController.getItemDetail));

// Route to build management view
router.get(
  "site-name/inv/",
  utilities.handleErrors(invController.buildManagement)
);

// Route to build management view
router.get(
  "/Classifications/AddNew",
  utilities.handleErrors(invController.buildAddClassifications)
);

module.exports = router;
