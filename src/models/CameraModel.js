// models/CameraModel.js
const pool = require("../config/database");

class CameraModel {
  /* แสดงกล้องทั้งหมด */
  static async getAllCameras() {
    const query = `
      SELECT camera_id, camera_name, camera_lat, camera_lng, camera_rtsp_path, camera_district
      FROM public.camera_management;`;

    const { rows } = await pool.query(query);
    return rows;
  }

  static async getAllPolygon() {
    const query = `
      SELECT id, name, coordinates
      FROM public.aria;`;

    const { rows } = await pool.query(query);
    return rows;
  }

  /* เพิ่มกล้อง */
  static async saveCamera(cameraData) {
    const {
      camera_name,
      camera_lat,
      camera_lng,
      camera_rtsp_path,
      camera_district,
    } = cameraData;

    const query = `
      INSERT INTO camera_management (camera_name, camera_lat, camera_lng, camera_rtsp_path, camera_district)
      VALUES ($1, $2, $3, $4, $5)`;
    const values = [
      camera_name,
      camera_lat,
      camera_lng,
      camera_rtsp_path,
      camera_district,
    ];

    const result = await pool.query(query, values);
    return result;
  }

  static async getDistrict() {
    const query = `
      SELECT id, name
      FROM public.aria;`;

    const { rows } = await pool.query(query);
    return rows;
  }
}

class CameraPageModel {
  static async getCamerasPage(page, perPage, searchWord) {
    const offset = (page - 1) * perPage;

    const whereClause = `
      (camera_name ILIKE $1 OR $1 IS NULL) 
      OR (camera_district ILIKE $1 OR $1 IS NULL)
    `;

    const query = `
      SELECT camera_id, camera_name, camera_lat, 
      camera_lng, camera_rtsp_path, camera_district
      FROM public.camera_management 
      WHERE ${whereClause}
      ORDER BY camera_id ASC 
      LIMIT $2 OFFSET $3;
    `;

    const search = searchWord ? `%${searchWord}%` : null;

    try {
      const result = await pool.query(query, [search, perPage, offset]);

      const data = result.rows;

      const totalCountQuery = `SELECT COUNT(*) FROM camera_management WHERE ${whereClause}`;
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
}

module.exports = { CameraModel, CameraPageModel };
