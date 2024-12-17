const pool = require("../config/database");
class filterModel {
  static async getGeographies() {
    const query = `
    SELECT id, name
    FROM public.a_geographies;`;

    const { rows } = await pool.query(query);
    const totalCountQuery = `SELECT COUNT(*) FROM public.a_geographies`;
    const totalCountResult = await pool.query(totalCountQuery);
    const total = parseInt(totalCountResult.rows[0].count);
    return { success: true, status: 200, total, data: rows };
  }
  static async getProvinces(geography_id) {
    const id = geography_id ? `${geography_id}` : null;
    const query = `
    SELECT pro.id AS province_id, pro.name_th,geo.name 
    FROM public.a_geographies geo
    JOIN public.a_provinces pro ON pro.geography_id = geo.id
    where pro.geography_id = $1 OR $1 IS NULL;`;
    const values = [id];
    const { rows } = await pool.query(query, values);
    const totalCountQuery = `SELECT COUNT(*) FROM public.a_provinces pro where pro.geography_id = $1 OR $1 IS NULL`;
    const totalCountValues = [id];
    const totalCountResult = await pool.query(totalCountQuery, totalCountValues);
    const total = parseInt(totalCountResult.rows[0].count);
    return { success: true, status: 200, total, data: rows };
  }

  static async getAmphures(province_id) {
    const query = `
        SELECT a.id, a.code, a.name_th AS name,  p.name_th AS name_province
                FROM public.a_amphures a
                JOIN public.a_provinces p ON a.province_id = p.id
                where a.province_id = $1;`;
    const values = [province_id];
    const { rows } = await pool.query(query, values);
    const totalCountQuery = `SELECT COUNT(*)  FROM public.a_amphures a where a.province_id = $1 `;
    const totalCountValues = [province_id];
    const totalCountResult = await pool.query(totalCountQuery, totalCountValues);
    const total = parseInt(totalCountResult.rows[0].count);
    return { success: true, status: 200, total, data: rows };
  }

  static async getTambons(amphure_id) {
    const query = `
            SELECT d.id ,  d.zip_code,  
            d.name_th AS name , 
            a.name_th AS amphure_name
        FROM public.a_tambon d 
        JOIN public.a_amphures a ON d.amphure_id  = a.id 
        where d.amphure_id = $1;`;
    const values = [amphure_id];
    const { rows } = await pool.query(query, values);
    const totalCountValues = [amphure_id];
    const totalCountQuery = `SELECT COUNT(*)  FROM public.a_tambon d where d.amphure_id = $1 `;
    const totalCountResult = await pool.query(totalCountQuery, totalCountValues);
    const total = parseInt(totalCountResult.rows[0].count);
    return { success: true, status: 200, total, data: rows };
  }

  static async getCameraSelects(province_id, amphure_id, tambol_id) {
    const query = `
        SELECT camera_id, name, status
      FROM public.camera  
      where 	is_delete ='false' AND
      province_id = $1 AND 
      amphure_id = $2 AND 
      tambon_id = $3 
 ; `;
    const values = [province_id, amphure_id, tambol_id];
    const { rows } = await pool.query(query, values);

    return { success: true, status: 200, data: rows };
  }
}
module.exports = filterModel;
