// models/CameraModel.js
const pool = require("../config/database");

class CamerasModel {
  static async getDistrictByid(id) {
    const query = `
    SELECT camera_id, name, 
    location, rtsp_path, 
    camera_lat, camera_lng, 
    district_id, status, 
    ip_address, port, 
    is_delete
	FROM public.camera
	where district_id = $1 AND is_delete = false;`;

    const Dis_id = id ? id : null;
    const result = await pool.query(query, [Dis_id]);
    const data = result.rows;

    const totalCountQuery = `SELECT COUNT(*) FROM public.camera WHERE district_id = $1 AND is_delete = false`;
    const totalCountResult = await pool.query(totalCountQuery, [Dis_id]);
    const total = parseInt(totalCountResult.rows[0].count);

    return {
      success: true,
      Dis_id,
      result: {
        total,
        data: data,
      },
    };
  }

  static async createCamera(camerasValues) {
    const {
      name,
      location,
      rtsp_path,
      camera_lat,
      camera_lng,
      district_id,
      status,
      ip_address,
      port,
      created_by,
    } = camerasValues;

    const query = `INSERT INTO public.camera(
     name, location, rtsp_path, 
      camera_lat, camera_lng, district_id, 
      status, ip_address, port, 
      created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
    const values = [
      name,
      location,
      rtsp_path,
      camera_lat,
      camera_lng,
      district_id,
      status,
      ip_address,
      port,
      created_by,
    ];
    const result = await pool.query(query, values);
    return result.rows[0]; // Return the newly created employee
  }

  static async editCamera(camerasEdit) {
    const {
      name,
      location,
      rtsp_path,
      camera_lat,
      camera_lng,
      district_id,
      status,
      ip_address,
      port,
      modified_by,
      camera_id
    } = camerasEdit;

    const query = `UPDATE public.camera
    SET 
      name = $1, 
      location = $2, 
      rtsp_path= $3, 
      camera_lat = $4, 
      camera_lng = $5,
      district_id = $6, 
      ip_address = $7, 
      port = $8, 
      modified_by= $9, 
      modified_date= NOW(),
      status = $10
    WHERE camera_id = $11 RETURNING camera_id, modified_by`;
    const values = [
      name,
      location,
      rtsp_path,
      camera_lat,
      camera_lng,
      district_id,
      ip_address,
      port,
      modified_by,
      status,
      camera_id,
    ];
    const result = await pool.query(query, values);
    return result.rows[0]; // Return the newly created employee
  }

  static async getAllCameras() {
    const query = `
    SELECT 
    camera_id, name, location, rtsp_path, 
    camera_lat, camera_lng, district_id, 
    status, ip_address, port, 
    created_by, created_date, 
     is_delete
    FROM public.camera
    WHERE is_delete = false`;

    const { rows } = await pool.query(query);

    return rows;
  }

  static async getDistrict() {
    const query = `
    SELECT id, name
    FROM public.district;`;

    const { rows } = await pool.query(query);
    return rows;
  }

  static async getAllPolygon() {
    const query = `
      SELECT id, name, coordinates
      FROM public.district`;

    const { rows } = await pool.query(query);
    return rows;
  }

  static async getCamerasPage(page, perPage, searchWord) {
    const offset = (page - 1) * perPage;
  
    const whereClause = `
      (c.name ILIKE $1 OR $1 IS NULL) 
      OR (d.name ILIKE $1 OR $1 IS NULL)
    `;
  
    const query = `
      SELECT c.camera_id, c.name, c.location, 
        c.rtsp_path, c.camera_lat, c.camera_lng, 
        c.district_id, 
        d.id AS district_id, d.name AS district_name,
        c.status, c.ip_address, 
        c.port, c.created_by, c.created_date, 
        c.modified_by, c.modified_date,
        c.is_delete
        
      FROM public.camera AS c
      LEFT JOIN public.district AS d ON c.district_id = d.id
      WHERE ${whereClause}
      ORDER BY c.camera_id ASC 
      LIMIT $2 OFFSET $3;
    `;
  
    const search = searchWord ? `%${searchWord}%` : null;
  
    try {
      const result = await pool.query(query, [search, perPage, offset]);
  
      const data = result.rows;
  
      // Include d alias in COUNT query as well
      const totalCountQuery = `SELECT COUNT(*) FROM public.camera AS c LEFT JOIN public.district AS d ON c.district_id = d.id WHERE ${whereClause}`;
      const totalCountResult = await pool.query(totalCountQuery, [search]);
      const total = parseInt(totalCountResult.rows[0].count);
      const dataResult = data.map((row, index) => {
        const number = offset + index + 1;
        return {
          no: number,
          ...row,
        };
      });
      return {
        success: true,
        search,
        result: {
          page,
          perPage,
          totalPages: Math.ceil(total / perPage),
          total,
          data: dataResult,
        },
      };
    } catch (error) {
      console.error("Error executing query", error);
      throw new Error("Internal server error");
    }
  }
  
  static async addLiveCamera(Values) {
    const { user_id, layout, cameras, created_by, modified_by } =
      Values;

    const existingUserQuery = `
      SELECT live_id, user_id
      FROM  public.live_view
      WHERE user_id = $1
      `;
    const existingUser = await pool.query(existingUserQuery, [user_id]);

    if (existingUser.rows.length > 0) {
      // update
      // If a user with the same username already exists, respond with an error message
      console.log({ status: 400, message: "มีชื่อผู้ใช้แล้ว กรุณาลองใหม่" });
      const queryUpdate = `
        UPDATE public.live_view
          SET 
          layout= $1, 
          cameras=$2, 
          modified_by= $3, 
          modified_date= NOW()
      WHERE user_id = $4 RETURNING user_id,live_id ;`;
      const valuesUpdate = [layout, JSON.stringify(cameras), modified_by, user_id ];

      const result = await pool.query(queryUpdate, valuesUpdate);
      return result.rows[0];

    } else {
      // insert
      const queryInsert = `
          INSERT INTO public.live_view(
              user_id, 
              layout, 
              cameras, 
              created_by
              ) 
          VALUES ($1, $2, $3, $4)  RETURNING *;`;
      const valuesInsert = [user_id, layout, JSON.stringify(cameras), created_by];

      const result = await pool.query(queryInsert, valuesInsert);
      return result.rows[0];
    }
  }

  static async getCamerasByIds(cameraIds) {
    // Create a comma-separated string of the camera IDs for the WHERE IN clause
    const cameraIdString = cameraIds.join(',');
  
    const query = `
    SELECT 
      lv.live_id, lv.user_id, lv.layout, lv.cameras,
      c.camera_id, c.name, c.location, c.rtsp_path, 
      c.camera_lat, c.camera_lng, c.district_id, c.status, 
      c.ip_address, c.port, c.created_by AS camera_created_by, 
      c.created_date AS camera_created_date, c.modified_by AS camera_modified_by, 
      c.modified_date AS camera_modified_date, c.deleted_by AS camera_deleted_by, 
      c.deleted_date AS camera_deleted_date, c.is_delete AS camera_is_delete,
      lv.created_by AS live_created_by, lv.created_date AS live_created_date, 
      lv.modified_by AS live_modified_by, lv.modified_date AS live_modified_date, 
      lv.deleted_by AS live_deleted_by, lv.deleted_date AS live_deleted_date, 
      lv.is_delete AS live_is_delete
    FROM public.live_view lv
    JOIN public.camera c ON lv.cameras @> '[{"camera_id": ' || c.camera_id || '}]'
    WHERE c.camera_id IN (${cameraIdString});  -- Properly formatted IN clause
    `;
  
    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("Error retrieving cameras by IDs", error);
      throw new Error("Internal server error");
    }
  }
  
}

module.exports = { CamerasModel };
