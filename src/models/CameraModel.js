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
  
  static async checkDuplicateCameraName(name) {
    const query = `SELECT COUNT(*) FROM public.camera WHERE name = $1;`;
    const result = await pool.query(query, [name]);
    return result.rows[0].count > 0; // Return true if name exists
  }

  // /cameras/camera
  static async createCamera(camerasValues) {
    const {
      name,
      location,
      rtsp_path,
      camera_lat,
      camera_lng,
      district_id,
      geography_id,
      province_id,
      amphure_id,
      tambon_id,
      province_name,
      amphure_name,
      tambon_name,
      status,
      ip_address,
      port,
      created_by,
    } = camerasValues;

    const query = `INSERT INTO public.camera(
      name, location, rtsp_path, 
      camera_lat, camera_lng, district_id, 
      geography_id, province_id, amphure_id, tambon_id,province_name,
      amphure_name,
      tambon_name,
      status, ip_address, port, 
      created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);`;
    const values = [
      name,
      location,
      rtsp_path,
      camera_lat,
      camera_lng,
      district_id,
      geography_id,
      province_id,
      amphure_id,
      tambon_id,
      province_name,
      amphure_name,
      tambon_name,
      status,
      ip_address,
      port,
      created_by,
    ];

    const result = await pool.query(query, values);
    return result.rows[0]; // Return the newly created employee
  }
// /cameras/camera/:id
  static async editCamera(camerasEdit) {
    const {
      name,
      location,
      rtsp_path,
      camera_lat,
      camera_lng,
      district_id,
      geography_id,
      province_id,
      amphure_id,
      tambon_id,
      province_name,
      amphure_name,
      tambon_name,
      status,
      ip_address,
      port,
      modified_by,
      camera_id,
    } = camerasEdit;

    const query = `UPDATE public.camera
    SET 
      name = $1, 
      location = $2, 
      rtsp_path= $3, 
      camera_lat = $4, 
      camera_lng = $5,
      district_id = $6,
      geography_id = $7,
      province_id = $8,
      amphure_id = $9,
      tambon_id = $10, 
      province_name = $11,
      amphure_name= $12,
      tambon_name= $13,
      ip_address = $14, 
      port = $15, 
      modified_by= $16, 
      modified_date= NOW(),
      status = $17
      WHERE camera_id = $18 
      RETURNING camera_id, modified_by`;
    const values = [
      name,
      location,
      rtsp_path,
      camera_lat,
      camera_lng,
      district_id,
      geography_id,
      province_id,
      amphure_id,
      tambon_id,
      province_name,
      amphure_name,
      tambon_name,
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

  // cameras/page
  static async getCamerasPage(page, perPage, searchWord) {
    const offset = (page - 1) * perPage;

    const whereClause = `
      (c.name ILIKE $1 OR $1 IS NULL) OR 
      (d.name ILIKE $1 OR $1 IS NULL) OR 
      (tambon.name_th ILIKE $1 OR $1 IS NULL) OR 
      (amphures.name_th ILIKE $1 OR $1 IS NULL) OR 
      (provinces.name_th ILIKE $1 OR $1 IS NULL) 
    `;

    const query = `
      SELECT 
      c.camera_id, c.name, c.location, 
      c.rtsp_path, c.camera_lat, c.camera_lng, 
      c.province_name, c.amphure_name, c.tambon_name,
      c.district_id, d.id AS district_id, 
      d.name AS district_name, 
      c.status, c.ip_address, c.port,  
      c.geography_id, geographies.id AS geography_id, geographies.name AS geo_name,
      c.province_id, provinces.id AS province_id,  provinces.name_th AS pro_name, 
      c.amphure_id, amphures.id AS amphure_id, amphures.name_th AS amp_name,  
      c.tambon_id,  tambon.name_th AS tamb_name, 
      c.created_by, c.created_date, 
      c.modified_by, c.modified_date, c.deleted_by, 
      c.deleted_date,  c.is_delete
        FROM 
            public.camera AS c
        LEFT JOIN 
            public.district AS d ON c.district_id = d.id
        LEFT JOIN 
            public.a_tambon AS tambon ON c.tambon_id = tambon.id
        LEFT JOIN 
            public.a_amphures AS amphures ON c.amphure_id = amphures.id
        LEFT JOIN 
            public.a_provinces AS provinces ON c.province_id = provinces.id
        LEFT JOIN 
            public.a_geographies AS geographies ON c.geography_id = geographies.id
        WHERE ${whereClause} 
        ORDER BY c.camera_id ASC LIMIT $2 OFFSET $3;
    `;

    const search = searchWord ? `%${searchWord}%` : null;

    try {
      const result = await pool.query(query, [search, perPage, offset]);

      const data = result.rows;

      // Include d alias in COUNT query as well
      const totalCountQuery = `
        SELECT COUNT(*) FROM public.camera AS c LEFT JOIN public.district AS d ON c.district_id = d.id  
          LEFT JOIN  
            public.a_tambon AS tambon ON c.tambon_id = tambon.id
          LEFT JOIN 
            public.a_amphures AS amphures ON c.amphure_id = amphures.id
          LEFT JOIN 
            public.a_provinces AS provinces ON c.province_id = provinces.id
          LEFT JOIN 
            public.a_geographies AS geographies ON c.geography_id = geographies.id 
        WHERE ${whereClause}`;
      const totalCountResult = await pool.query(totalCountQuery, [search]);
      const total = parseInt(totalCountResult.rows[0].count);

      const dataResult = data.map((row, index) => {
        const number = offset + index + 1;
        return {
          no: number,
          camera_id: row.camera_id,
          name: row.name,
          rtsp_path: row.rtsp_path,
          camera_lat: row.camera_lat,
          camera_lng: row.camera_lng,
          location: row.location,
          location_camera: {
            geography: {
              id: row.geography_id,
              name: row.geo_name,
            },
            provinces: {
              id: row.province_id,
              name: row.pro_name,
            },
            amphures: {
              id: row.amphure_id,
              name: row.amp_name,
            },
            tambons: {
              id: row.tambon_id,
              name: row.tamb_name,
            },
            district: {
              id: row.district_id,
              name: row.district_name,
            },
            province_name: row.province_name,
            amphure_name: row.amphure_name,
            tambon_name: row.tambon_name,
          },
          status: row.status || "unknown",  // Default to 'unknown' if null
          ip_address: row.ip_address || "N/A", // Default to 'N/A' if null
          port: row.port || "N/A",  // Default to 'N/A' if null

          created_by: row.created_by,
          created_date: row.created_date,
          modified_by: row.modified_by,
          modified_date: row.modified_date,
          deleted_by: row.deleted_by,
          deleted_date: row.deleted_date,
          is_delete: row.is_delete,
        };
      });
      return {
        success: true,
        status: 200,
        message: "OK",
        result: {
          pagination: {
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
            totalItems: total,
          },
          search,
          data: dataResult,
        },
      };
    } catch (error) {
      console.error("Error executing query", error);
      throw new Error("Internal server error");
    }
  }

  static async addLiveCamera(Values) {
    const { user_id, layout, cameras, created_by, modified_by } = Values;

    const existingUserQuery = `
      SELECT live_id, user_id
      FROM  public.live_view
      WHERE user_id = $1
      `;
    const existingUser = await pool.query(existingUserQuery, [user_id]);

    if (existingUser.rows.length > 0) {
      // update
      // If a user with the same username already exists, respond with an error message
      console.log({
        status: 400,
        message: "ผู้ใช้มีจัดมีประวัติการจัดเรียงแล้ว",
      });

      const queryUpdate = `
        UPDATE public.live_view
          SET 
          layout= $1, 
          cameras=$2, 
          modified_by= $3, 
          modified_date= NOW()
      WHERE user_id = $4 RETURNING user_id,live_id ;`;
      const valuesUpdate = [
        layout,
        JSON.stringify(cameras),
        modified_by,
        user_id,
      ];

      const result = await pool.query(queryUpdate, valuesUpdate);
      return {
        status: 200,
        success: true,
        message: "Update successfully!",
        Camera: result.rows[0],
      };
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
      const valuesInsert = [
        user_id,
        layout,
        JSON.stringify(cameras),
        created_by,
      ];

      const result = await pool.query(queryInsert, valuesInsert);
      return {
        status: 200,
        success: true,
        message: "Add live_view successfully!",
        Camera: result.rows[0],
      };
    }
  }

  static async getCamerasByIds(userId) {
    const userquery = `
      SELECT lv.live_id, lv.user_id, 
          lv.layout, 
          u.username, u.email, u.role_id
      FROM public.live_view lv
          JOIN public.users u ON lv.user_id = u.user_id
      WHERE lv.user_id = $1;
          `;

    const query = `SELECT 
        c.camera_id, c.name, c.location, c.rtsp_path, 
        c.camera_lat, c.camera_lng, c.district_id, c.status, 
        c.ip_address, c.port, c.created_by, c.created_date, 
        c.modified_by, c.modified_date, c.deleted_by, 
        c.deleted_date, c.is_delete,        
        t.name_th AS tambon_name,
        a.name_th AS amphure_name,
        p.name_th AS province_name,
        g.name AS geography_name

        FROM public.camera c
        JOIN (
            SELECT lv.live_id, lv.user_id, jsonb_array_elements(lv.cameras) ->> 'camera_id' AS camera_id
            FROM public.live_view lv
            WHERE lv.user_id = $1
        ) lv ON lv.camera_id::int = c.camera_id
        
        LEFT JOIN 
          public.a_tambon t ON c.tambon_id = t.id
      LEFT JOIN 
          public.a_amphures a ON c.amphure_id = a.id
      LEFT JOIN 
          public.a_provinces p ON c.province_id = p.id
      LEFT JOIN 
          public.a_geographies g ON c.geography_id = g.id;
  
  `;

    try {
      const result = await pool.query(query, [userId]);
      const camera = result.rows;

      const rowsuser = await pool.query(userquery, [userId]);
      const user = rowsuser.rows[0];
      return { user, camera };
    } catch (error) {
      console.error("Error retrieving cameras by IDs", error);
      throw new Error("Internal server error");
    }
  }
}

module.exports = { CamerasModel };
