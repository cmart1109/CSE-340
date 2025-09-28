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

module.exports = {getClassifications, getInventoryByClassificationId, addClassification, getClassificationByName}