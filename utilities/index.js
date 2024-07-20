const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
    grid = '<ul id="inv-display" class="classification-page">';
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
 * Build Classification List
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  console.log("data", data);
  let classificationList =
    '<div class="classificationList"' +
    "<label>Classification: </label>" +
    '<select name="classification_id" id="classificationList" required>';

  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select></div>";
  return classificationList;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  res.locals.accountData = null;
  res.locals.loggedin = 0;

  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        console.log("JWT verified, accountData:", accountData);
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 * Middleware to check account type
 **************************************** */
Util.checkAccountType = (requiredTypes) => {
  return (req, res, next) => {
    const accountData = res.locals.accountData;
    console.log("Checking account type, accountData:", accountData);

    if (accountData && requiredTypes.includes(accountData.account_type)) {
      next();
    } else {
      req.flash("error", "Access denied. Insufficient permissions.");
      res.redirect("/account/login");
    }
  };
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

// checkLoginStatus

Util.loginStatus = (req, res, next) => {
  res.locals.clientLoggedIn = req.session && req.session.user ? true : false;
  next();
};

/* ****************************************
 * Build Reviews List
 **************************************** */
Util.buildReviewsList = async function (inv_id, loggedIn) {
  // Fetch the reviews for the given inv_id
  let data = await invModel.getReviewsById(inv_id);
  console.log("data", data);
  let reviewsList = '<div class="reviewsList"><h2>Reviews</h2>';

  // Check if there are no reviews
  if (!data || data.length === 0) {
    reviewsList += "<div class='reviewsList-body'>";
    reviewsList += "<p>Be the first to leave a review!</p>";

    // Check if the user is logged in
    if (!loggedIn || loggedIn === "undefined") {
      reviewsList +=
        "<p>You must be <a class='review-login' href='/account/login'>logged in</a> to leave a review</p>";
    } else {
      reviewsList += `<div class="reviews-form">
             <h3>Write a review</h3>
             <form method="POST" action="/inv/detail/${inv_id}">
               <div>
                 <label for="user">Username:</label>
                 <input type="text" id="username" name="username" required>
               </div>
               <div>
                 <label for="review">Review: </label>
                 <textarea id="review_text" name="review_text" required></textarea>
               </div>
               <div>
                 <button type="submit">Submit Review</button>
               </div>
             </form>
           </div>`;
    }
  } else {
    // Render reviews if they exist
    reviewsList += "<ul>";

    data.forEach((row) => {
      reviewsList += "<li>";
      reviewsList += "<p>" + row.review_text + "</p>";
      reviewsList += "<p>By: " + row.reviewer_name + "</p>";
      reviewsList += "</li>";
    });

    reviewsList += "</ul>";
  }

  reviewsList += "</div>";

  return reviewsList;
};

module.exports = Util;
