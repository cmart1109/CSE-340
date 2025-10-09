const pool = require("../database/")

async function getReviewsByCar(car_id) {
    try {
        const sql = `SELECT inv_id, review_id, reviews.account_id, account_firstname, account_lastname, rating, comment FROM public.reviews
    JOIN public.account ON account.account_id = reviews.account_id WHERE inv_id = $1;
    `
        const result = await pool.query(sql, [car_id])
        return result.rows
    } catch (error) {
        console.error("Get Reviews Error " + error)
    }
}

async function addReview(inv_id, account_id, rating, comment) {
  const sql = `
    INSERT INTO public.reviews (
      inv_id,
      account_id,
      rating,
      comment
    )
    VALUES ($1, $2, $3, $4)
    RETURNING review_id;
  `;

  const values = [
    inv_id,       
    account_id,   
    rating,       
    comment       
  ];

  try {
    const result = await pool.query(sql, values);
    return result.rows[0]; 
  } catch (error) {
    console.error("Error inserting review:", error);
    throw error;
  }
}

module.exports = { getReviewsByCar, addReview }