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

/* ***************************
 *  Build inventory by detail view
 * ************************** */

// invCont.getItemDetail = async function (req, res, next) {
//   try {
//     const item_id = req.params.id;
//     const item = await invModel.getItemById(item_id);
//     if (!item) {
//       return res.status(404).json({ message: "Item not found" });
//     }

//     const detail_view = await utilities.buildDetailView(item);
//     let nav = await utilities.getNav();

//     res.render("./inventory/itemDetail", {
//       title: item.name,
//       nav,
//       detail_view,
//       item,
//     });
//   } catch (error) {
//     console.error("Get Item Detail Error:", error); // Log the error for debugging
//     res.status(500).json({ message: "Server error", error });
//   }
// };

module.exports = invCont;
