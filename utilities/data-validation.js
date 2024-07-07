const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model");

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
  return [
    // Check if the classification name is provided
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("A new classification is required.")
      .matches(/^[^\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)
      .withMessage("Classification name does not meet requirements.")
      // Check if the classification already exists in the database
      .custom(async (classification_name) => {
        console.log(
          "Custom validation check for classification_name:",
          classification_name
        );

        // Check if the classification exists in the database
        const classificationExists = await invModel.checkExistingClassification(
          classification_name
        );

        console.log("Does classification exist?", classificationExists);

        if (classificationExists) {
          throw new Error("Classification exists. Please try again.");
        }
      }),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);

  // Log validation errors if they exist
  if (!errors.isEmpty()) {
    console.log("Validation errors found:", errors.array());

    const nav = await utilities.getNav();

    // Render the form with errors and log the rendering action
    console.log("Rendering /inventory/addClassification with errors");
    res.render("inventory/addClassification", {
      errors: errors.array(),
      title: "Add Classification",
      nav,
      classification_name: req.body.classification_name,
    });
    return;
  }

  // Log when there are no validation errors and the function proceeds to the next middleware
  console.log("No validation errors. Proceeding to the next middleware.");
  next();
};

module.exports = validate;
