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

// Route to trigger error
router.get("/triggerError", utilities.handleErrors(invController.triggerError));

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get(
  "/addClassification",
  utilities.handleErrors(invController.buildAddClassification)
);

module.exports = router;
