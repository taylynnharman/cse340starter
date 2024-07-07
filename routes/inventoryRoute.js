// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const invValidate = require("../utilities/data-validation");

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

// Process the classification data
router.post(
  "/addClassification",
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to build add vehicle view
router.get(
  "/addInventory",
  utilities.handleErrors(invController.buildAddInventory)
);

// Process the registration data
// router.post(
//   "/inv"
// invValidate.registationRules(),
// invValidate.checkRegData,
// utilities.handleErrors(accountController.registerAccount)
// );

module.exports = router;
