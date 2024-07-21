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
    title: className,
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.getItemDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.id;
    const item = await invModel.getItemById(inv_id);

    if (!item) {
      // Item not found
      return res.status(404).json({ message: "Vehicle not found" });
    }

    let reviewsList;
    const loggedIn = res.locals.loggedin;

    if (loggedIn) {
      // User is logged in
      const accountData = res.locals.accountData;
      const username = `${accountData.account_firstname.charAt(0)}${
        accountData.account_lastname
      }`;
      const account_id = accountData.account_id;
      reviewsList = await utilities.buildReviewsList(
        inv_id,
        loggedIn,
        username,
        account_id
      );
    } else {
      // User is not logged in
      reviewsList = await utilities.buildReviewsList(inv_id, loggedIn);
    }

    // Build the detail view and navigation
    const detail_view = await utilities.buildDetailView(item);
    const nav = await utilities.getNav();

    // Render the item detail view
    res.render("./inventory/detailView", {
      title: item.name,
      nav,
      detail_view,
      inv_id,
      reviewsList,
      item,
    });
  } catch (error) {
    console.error("Get Item Detail Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/* ****************************************
 *  Trigger Error
 * *************************************** */
invCont.triggerError = async function (req, res, next) {
  let nav = await utilities.getNav();
  const triggerError = await utilities.triggerError();
  res.render("./inventory/triggerError", {
    title: "Trigger Error View",
    nav,
    triggerError,
  });
};

/* ****************************************
 *  Build Management View
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Management View",
    nav,
    errors: null,
    classificationSelect,
  });
};

/* ****************************************
 *  Build Add Classification View
 * *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/addClassification", {
    title: "Add Classification View",
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
      res.redirect("/inv/addClassification");
    }
  } catch (error) {
    console.error(error);
    req.flash(
      "notice",
      "An unexpected error occurred. Please try again later."
    );
    res.redirect("/inv/addClassification");
  }
};

/* ****************************************
 *  Build Add Inventory View
 * *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("./inventory/addInventory", {
    title: "Add Inventory",
    nav,
    classificationList,
  });
};

/* ****************************************
 *  Process Add Inventory
 * *************************************** */
invCont.addInventory = async function (req, res) {
  try {
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    // Add the inventory item
    const regResult = await invModel.addInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );

    if (regResult) {
      // Set success flash message
      req.flash("notice", `${make} ${model} added to Inventory.`);

      // Redirect to a success page or view
      res.redirect("/");
    } else {
      // Set error flash message
      req.flash("notice", "Sorry, an error occurred. Please try again.");

      // Redirect back to the form
      res.redirect("/inv/addInventory");
    }
  } catch (error) {
    console.error(error);
    req.flash(
      "notice",
      "An unexpected error occurred. Please try again later."
    );
    res.redirect("/inv/addInventory");
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build update inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getItemById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect, // Use this in your EJS template
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inventory/management");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

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
    title: className,
    nav,
    grid,
  });
};

module.exports = invCont;
