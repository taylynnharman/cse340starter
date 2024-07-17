const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model");

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .matches(/^[^\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)

      // Check if the classification already exists in the database
      .custom(async (classification_name) => {
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
  next();
};

/*  **********************************
 *  Utility function to validate inventory data
 * ********************************* */
validate.checkInventoryData = async (req, res, next) => {
  const errors = [];
  const data = req.body;

  // Check for inv_id
  if (!data.inv_id || isNaN(parseInt(data.inv_id))) {
    errors.push("Inventory ID is required and should be a valid number.");
  }

  // Check for required fields
  if (!data.make || typeof data.make !== "string" || data.make.trim() === "") {
    errors.push("Make is required and should be a non-empty string.");
  }
  if (
    !data.model ||
    typeof data.model !== "string" ||
    data.model.trim() === ""
  ) {
    errors.push("Model is required and should be a non-empty string.");
  }
  if (
    !data.year ||
    isNaN(data.year) ||
    data.year < 1900 ||
    data.year > new Date().getFullYear()
  ) {
    errors.push(
      "Year is required and should be a valid number between 1900 and the current year."
    );
  }
  if (
    !data.description ||
    typeof data.description !== "string" ||
    data.description.trim() === ""
  ) {
    errors.push("Description is required and should be a non-empty string.");
  }
  if (typeof data.price !== "number" || data.price <= 0) {
    errors.push("Price is required and should be a positive number.");
  }
  if (typeof data.miles !== "number" || data.miles < 0) {
    errors.push("Miles is required and should be a non-negative number.");
  }
  if (
    !data.color ||
    typeof data.color !== "string" ||
    data.color.trim() === ""
  ) {
    errors.push("Color is required and should be a non-empty string.");
  }
  if (!data.classification_id || isNaN(data.classification_id)) {
    errors.push("Classification ID is required and should be a valid number.");
  }

  return errors;
};

// Utility function to validate inventory data in edit view
validate.checkUpdateData = async (req, res, next) => {
  // Extract validation results
  const errors = validationResult(req);

  // Log validation errors if they exist
  if (!errors.isEmpty()) {
    console.log("Validation errors found:", errors.array());

    // Retrieve necessary data for rendering the form
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(
      req.body.classification_id
    );

    // Render the form with errors
    console.log("Rendering /inventory/edit-inventory with errors");
    res.render("inventory/edit-inventory", {
      errors: errors.array(),
      title: "Edit " + req.body.inv_make + " " + req.body.inv_model, // Dynamically set title
      nav,
      inv_id: req.body.inv_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      classification_id: req.body.classification_id,
      classificationSelect, // Include classification select options
    });
    return;
  }

  // Continue to the next middleware or controller if no errors
  next();
};

module.exports = validate;
