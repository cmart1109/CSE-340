const pool = require("../database/");

async function getInventory() {
    return await pool.query("SELECT * FROM public.inventory");
}


async function getCarDetails(carId) {
    try {   
        const query = `SELECT * FROM public.inventory WHERE inv_id = $1`;
        const param = [parseInt(carId)]
        console.log("Running car details query:", query, param);
        const result = await pool.query(query, param);
        return result.rows[0]; 

    } catch (error) {
        console.error("Error fetching car details:", error);
        throw error;
    }
}


module.exports = {getCarDetails, getInventory}