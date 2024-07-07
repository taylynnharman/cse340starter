const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.getItemDetail = async function (req, res, next) {
  try {
    const item_id = req.params.id;

    // Check if item_id is equal to "error" to trigger the error
    if (item_id === "error") {
      throw new Error("Intentional server error");
    }

    const item = await invModel.getItemById(item_id);
    if (!item) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const detail_view = await utilities.buildDetailView(item);
    let nav = await utilities.getNav();

    res.render("./inventory/detailView", {
      title: item.name,
      nav,
      detail_view,
      item,
    });
  } catch (error) {
    console.error("Get Item Detail Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Trigger Error
invCont.triggerError = async function (req, res, next) {
  let nav = await utilities.getNav();
  const triggerError = await utilities.triggerError();
  res.render("./inventory/triggerError", {
    title: "Trigger Error View",
    nav,
    triggerError,
  });
};

// Build Management View
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Management View",
    nav,
  });
};

// Build Add Classification View
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/addClassification", {
    title: "Add Classification View",
    nav,
  });
};

// Build Add Vehicle View
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory View",
    nav,
  });
};

/* ****************************************
 *  Process New Classification
 * *************************************** */
invCont.addClassification = async function (req, res) {
  try {
    let { classification_name } = req.body;

    classification_name =
      classification_name.charAt(0).toUpperCase() +
      classification_name.slice(1).toLowerCase();

    // Add the classification
    const regResult = await invModel.addClassification(classification_name);

    if (regResult) {
      // Set success flash message
      req.flash("notice", `${classification_name} added to classifications.`);

      // Redirect to a success page or view
      res.redirect("/inv/");
    } else {
      // Set error flash message
      req.flash("notice", "Sorry, an error occurred. Please try again.");

      // Redirect back to the form
      res.redirect("/inventory/addClassification");
    }
  } catch (error) {
    console.error(error);
    req.flash(
      "notice",
      "An unexpected error occurred. Please try again later."
    );
    res.redirect("/inventory/addClassification");
  }
};

module.exports = invCont;
