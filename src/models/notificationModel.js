// src/models/notificationModel.js
const pool = require("../config/database");

class NotificationsModel {
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
      fullimg
    ]);
    return rows[0].noti_id;
  }
}
module.exports = { NotificationsModel };
