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
            RETURNING noti_id;`;

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
  static async countToday() {
    const todayQuery = `SELECT COUNT(*)
    FROM public.noti_from_socket
    WHERE datetime >= CURRENT_DATE
      AND datetime < CURRENT_DATE + INTERVAL '1 day';`;
    const resultToday = await pool.query(todayQuery);
    const totalToday = parseInt(resultToday.rows[0].count);

    return  totalToday ;
  }
  static async countSevendays() {
    const Query = `SELECT COUNT(*) 
      FROM public.noti_from_socket
      WHERE datetime >= NOW() - INTERVAL '7 days';`;
    const result = await pool.query(Query);
    const totalSevenday = parseInt(result.rows[0].count);

    return totalSevenday ;
  }
  static async countTypeToday() {
    const query = `WITH distinct_types AS (
            SELECT DISTINCT type
            FROM public.noti_from_socket
        )
        SELECT 
            dt.type, 
            COALESCE(COUNT(n.type), 0) AS count_today
        FROM 
            distinct_types dt
        LEFT JOIN 
            public.noti_from_socket n
        ON 
            dt.type = n.type
            AND n.datetime >= CURRENT_DATE 
            AND n.datetime < CURRENT_DATE + INTERVAL '1 day'
        GROUP BY 
            dt.type;
`;
    const { rows } = await pool.query(query);
    const dataResult = rows.map((row, index) => {
      const number = index + 1;
      return {
        no: number,
        ...row,
      };
    });
    return dataResult;
  }

  static async getNotifications({
    type,
    camera,
    plate,
    page,
    perPage,
    startDateTime,
    endDateTime,
  }) {
    const offset = (page - 1) * perPage;
    const whereDatetime = `(datetime BETWEEN $1 AND $2 OR $1 IS NULL AND $2 IS NULL)`;
    const whereClause = ` 
        (type ILIKE $3 OR $3 IS NULL)
        AND (camera ILIKE $4 OR $4 IS NULL)
        AND (
        (plate ILIKE $5 OR $5 IS NULL) OR 
        (country ILIKE $5 OR $5 IS NULL)
        )`;
    const query = `
      SELECT noti_id, type, map_camera_id, camera, 
plate, country, timestamp_from, cropimg, fullimg, 
datetime, status, description, camera_group, matched_dossier, 
comment, matched_lists
      FROM public.noti_from_socket
      WHERE ${whereDatetime} AND ${whereClause}  
      ORDER BY datetime DESC
      OFFSET $6 LIMIT $7;
    `;
    const type_value = type ? `%${type}%` : null;
    const camera_value = camera ? `%${camera}%` : null;
    const plate_value = plate ? `%${plate}%` : null;
    const start = startDateTime || null;
    const end = endDateTime || null;
    // Add '%' wildcard for ILIKE pattern matching
    const result = await pool.query(query, [
      start,
      end,
      type_value,
      camera_value,
      plate_value,
      offset,
      perPage,
    ]);
    const data = result.rows;
    const totalCountQuery = `SELECT COUNT(*) FROM public.noti_from_socket
      WHERE ${whereDatetime} AND ${whereClause}`;
    const totalCountResult = await pool.query(totalCountQuery, [
      start,
      end,
      type_value,
      camera_value,
      plate_value,
    ]);
    const total = parseInt(totalCountResult.rows[0].count);
    const dataResult = data.map((row, index) => {
      const number = offset + index + 1;
      return {
        no: number,
        ...row,
      };
    });
    // const todayQuery = `SELECT COUNT(*)
    //     FROM public.noti_from_socket
    //     WHERE datetime >= CURRENT_DATE
    //       AND datetime < CURRENT_DATE + INTERVAL '1 day';`;
    // const resultToday = await pool.query(todayQuery);
    // const totalToday = parseInt(resultToday.rows[0].count);

    return {
      dataTimeLoad: new Date().toISOString(), // Add current date-time
      //statistics: { totalToday },
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
      total,
      range: { startDateTime, endDateTime },
      search: { type, camera, plate },
      notifications: dataResult,
    };
  }
}
module.exports = { NotificationsModel };
