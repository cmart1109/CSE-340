const pool = require("../database/");

async function getCarDetails(carId) {
    const query = `SELECT * FROM public.inventory WHERE inv_id = $1`;
    const param = [carId];
    console.log("Running car details query:", query, param);
    const result = await pool.query(query, param);
    return result.rows; 
}


module.exports = {getCarDetails}