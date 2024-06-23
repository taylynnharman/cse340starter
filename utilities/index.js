const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 *  function that will take the specific vehicle's information and wrap it up in HTML to deliver to the view
 **************************************** */
Util.buildDetailView = async function (data) {
  let detail_view;
  if (data) {
    detail_view = `
      <div id="inv-display" class="inv-display">
            <img src="${data.inv_image}" alt="${data.inv_year} ${
      data.inv_make
    } ${data.inv_model} on CSE Motors" />
          <div class="namePrice">
            <h2 class="vehicle-info">${data.inv_year} ${data.inv_make} ${
      data.inv_model
    } </h2>
            <hr />
            <h3 class="detail-list"><li>Mileage: ${new Intl.NumberFormat(
              "en-US"
            ).format(data.inv_miles)}</li>
             <li>Price: $${new Intl.NumberFormat("en-US").format(
               data.inv_price
             )}</li></h3>
  
          </div>
      </div>`;
  } else {
    detail_view =
      '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return detail_view;
};

/* ****************************************
 *  function that will build management view
 **************************************** */
Util.buildManagement = async function () {
  let management = `
      <h1>Management View</h1>
      <a href="/Classifications/AddNew">Add New Classification</a>
      <a href="/Inventory/AddNew">Add New Inventory Item</a>      
`;
  return management;
};
module.exports = Util;
