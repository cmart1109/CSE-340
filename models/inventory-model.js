const pool = require("../database/")

async function getClassifications() {
    return await pool.query("SELECT * FROM  public.classification ORDER BY classification_name")
}

async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
      [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

async function addClassification(classification_name) {
    try {
        const sql = `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`
        const result = await pool.query(sql, [classification_name])
        return result.rows[0]
    } catch (error) {
        console.error("addClassification error " + error)
    }
}

async function getClassificationByName(classification_name) {
  try {
    const data = await pool.query(
      "SELECT * FROM classification WHERE classification_name = $1",
      [classification_name]
    )
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

async function registerInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = `
      INSERT INTO public.inventory (
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
    `
    const result = await pool.query(sql, [
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    ])
    return result.rows[0]
  } catch (error) {
    console.error("registerInventory error " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, addClassification, getClassificationByName, registerInventory}