const { check } = require("express-validator");
const pool = require("../database/index");

/* ***************************
 *  Get reviews data based on inventory id
 * ************************** */
async function getReviewsById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT r.*, a.account_firstname, a.account_lastname
         FROM public.reviews r
         JOIN public.account a ON r.account_id = a.account_id
         WHERE r.inv_id = $1
         ORDER BY r.review_date DESC`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getReviewsById error: " + error);
  }
}
/* ***************************
 *  Get reviews data based on account id
 * ************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const data = await pool.query(
      `SELECT r.*, i.inv_make, i.inv_model
       FROM public.reviews r
       JOIN public.inventory i ON r.inv_id = i.inv_id
       WHERE r.account_id = $1
       ORDER BY r.review_date DESC`,
      [account_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getReviewsByAccountId error " + error);
  }
}
/* ***************************
 *  Get reviews data based on account id
 * ************************** */
async function getReviewsByReviewId(review_id) {
  try {
    const data = await pool.query(
      `SELECT *
           FROM public.reviews
           WHERE review_id = $1`,
      [parseInt(review_id, 10)] // Convert to integer
    );
    console.log("data", data.rows[0].review_id);
    return data.rows[0]; // Return the single review object
  } catch (error) {
    console.error("getReviewByReviewId error: " + error);
    throw error; // Re-throw the error to handle it properly in the caller
  }
}
/* ***************************
 *  Add Review
 * ************************** */
async function insertReviewById(review_text, inv_id, account_id) {
  try {
    const sql =
      "INSERT INTO reviews (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *";
    const result = await pool.query(sql, [review_text, inv_id, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Database operation failed:", error);
    throw new Error("Database operation failed.");
  }
}
/* ***************************
 *  Delete Review
 * ************************** */
async function deleteReview(review_id) {
  try {
    const result = await pool.query(
      `DELETE FROM public.reviews
         WHERE review_id = $1`,
      [review_id]
    );
    return result;
  } catch (error) {
    console.error("getReviewsById error: " + error);
  }
}

/* ***************************
 *  Edit Review
 * ************************** */
async function editReview(review_id, review_text) {
  try {
    const result = await pool.query(
      `UPDATE public.reviews
           SET review_text = $1
           WHERE review_id = $2`,
      [review_text, review_id]
    );
    return result;
  } catch (error) {
    console.error("editReview error: " + error);
    throw error;
  }
}

module.exports = {
  getReviewsById,
  getReviewsByAccountId,
  insertReviewById,
  deleteReview,
  getReviewsByReviewId,
  editReview,
};
