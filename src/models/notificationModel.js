// src/models/notificationModel.js
const pool = require("../config/database");

class NotificationsModel {
  static async filterTpyeNoti() {
    const query = `SELECT DISTINCT type FROM public.noti_from_socket;`;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getCheckCamera(camera) {
    const query = `SELECT camera_id FROM public.camera WHERE name = $1`;

    // Execute the query with the provided parameter
    const { rows } = await pool.query(query, [camera]);
    return rows[0];
  }

  // Insert a new notification into the noti_from_socket table
  static async createNotiSocket(notificationsValues) {
    const {
      type,
      map_camera_id,
      camera,
      plate,
      country,
      timestamp_from,
      cropimg,
      fullimg,
    } = notificationsValues;

    const query = `
            INSERT INTO public.noti_from_socket 
            (type, map_camera_id, camera, plate, country, timestamp_from, cropimg, fullimg)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING noti_id;
        `;

    // Execute the query with the provided parameters
    const { rows } = await pool.query(query, [
      type,
      map_camera_id,
      camera,
      plate,
      country,
      timestamp_from,
      cropimg,
      fullimg,
    ]);
    return rows[0].noti_id;
  }
  static async getNotifications({ type, camera, plate, page, perPage }) {
    const offset = (page - 1) * perPage;
    const whereClause = ` (type ILIKE $1 OR $1 IS NULL)
        AND (camera ILIKE $2 OR $2 IS NULL)
        AND (plate ILIKE $3 OR $3 IS NULL) `;
    const query = `
      SELECT noti_id, type, map_camera_id, camera, plate, country, timestamp_from, datetime, status, description,cropimg, fullimg
      FROM public.noti_from_socket
      WHERE ${whereClause}  
      ORDER BY datetime DESC
      OFFSET $4 LIMIT $5;
    `;
    const type_value = type ? `%${type}%` : null;
    const camera_value = camera ? `%${camera}%` : null;
    const plate_value = plate ? `%${plate}%` : null;
    // Add '%' wildcard for ILIKE pattern matching
    const { rows } = await pool.query(query, [
      type_value,
      camera_value,
      plate_value,
      offset,
      perPage,
    ]);
    return rows;
  }
}
module.exports = { NotificationsModel };
