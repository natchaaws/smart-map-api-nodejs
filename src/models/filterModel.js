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

    const { rows } = await pool.query(query, [id]);
    const totalCountQuery = `SELECT COUNT(*) FROM public.a_provinces pro where pro.geography_id = $1 OR $1 IS NULL`;
    const totalCountResult = await pool.query(totalCountQuery, [id]);
    const total = parseInt(totalCountResult.rows[0].count);
    return { success: true, status: 200, total, data: rows };
  }

  static async getAmphures(province_id) {
    const query = `
        SELECT a.id, a.code, a.name_th AS name,  p.name_th AS name_province
                FROM public.a_amphures a
                JOIN public.a_provinces p ON a.province_id = p.id
                where a.province_id = $1;`;

    const { rows } = await pool.query(query, [province_id]);
    const totalCountQuery = `SELECT COUNT(*)  FROM public.a_amphures a where a.province_id = $1 `;
    const totalCountResult = await pool.query(totalCountQuery, [province_id]);
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

    const { rows } = await pool.query(query, [amphure_id]);

    const totalCountQuery = `SELECT COUNT(*)  FROM public.a_tambon d where d.amphure_id = $1 `;
    const totalCountResult = await pool.query(totalCountQuery, [amphure_id]);
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

    const { rows } = await pool.query(query, [
      province_id,
      amphure_id,
      tambol_id,
    ]);

    return { success: true, status: 200, data: rows };
  }
}
module.exports = filterModel;
