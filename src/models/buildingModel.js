const pool = require("../config/database");

class BulidingModel {
  /* BulidMarker */

  static async createBulidMarker(buildValues) {
    const {
      name,
      build_lat,
      build_lng,
      geography_id,
      province_id,
      amphure_id,
      tambon_id,
    } = buildValues;
    const query = `
    INSERT INTO public.building_marker(
        name, 
        build_lat, build_lng,
        geography_id, province_id, 
        amphure_id, tambon_id)
    VALUES 
        ($1, $2, $3, $4 ,$5 , $6 ,$7);`;
    const values = [
      name,
      build_lat,
      build_lng,
      geography_id,
      province_id,
      amphure_id,
      tambon_id,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async editBulidMarker(buildValues) {
    const {
      name,
      build_lat,
      build_lng,
      geography_id,
      province_id,
      amphure_id,
      tambon_id,
      id,
    } = buildValues;
    const query = `
        UPDATE public.building_marker
            SET
            name = $1, 
            build_lat = $2, 
            build_lng = $3,
            geography_id = $4, province_id = $5, 
            amphure_id = $6, tambon_id = $7
        WHERE id = $8 RETURNING id
   `;
    const values = [
      name,
      build_lat,
      build_lng,
      geography_id,
      province_id,
      amphure_id,
      tambon_id,
      id,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /* BulidFloor */
  static async createBulidFloor(floorValues) {
    const { name, floor, build_img, building_id } = floorValues;
    const query = `
    INSERT INTO public.building_floor(
        name, 
        floor,
        build_img, building_id)
        VALUES ($1, $2, $3 ,$4);`;
    const values = [name, floor, build_img, building_id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async editBulidFloor(floorValues) {
    const { name, floor, build_img, building_id, id } = floorValues;
    const query = `
        UPDATE public.building_floor
            SET
            name = $1, 
            floor = $2, 
            build_img = $3,
            building_id = $4
        WHERE id = $5 
        RETURNING id
   `;
    const values = [name, floor, build_img, building_id, id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /* LocationFloor */
  static async createLocationFloor(LocationfloorValues) {
    const { camera_name, rtsp_path, postion_x, postion_y, floor_id } =
      LocationfloorValues;
    const query = `
    INSERT INTO public.location_onfloor(
        camera_name, rtsp_path, postion_x, postion_y, floor_id)
        VALUES ($1, $2, $3,$4,$5);`;
    const values = [camera_name, rtsp_path, postion_x, postion_y, floor_id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async editLocationFloor(LocationfloorValues) {
    const { camera_name, rtsp_path, postion_x, postion_y, floor_id, id } =
      LocationfloorValues;
    const query = `
        UPDATE public.location_onfloor
            SET
            camera_name = $1, 
            rtsp_path = $2, 
            postion_x = $3,
            postion_y = $4, floor_id= $5
        WHERE id = $6 RETURNING id
   `;
    const values = [camera_name, rtsp_path, postion_x, postion_y, floor_id, id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /* Bulid For Table */
  static async getBulidPage(page, perPage, searchWord) {
    const offset = (page - 1) * perPage;
    const whereClause = `(name ILIKE $1 OR $1 IS NULL)`;

    const query = `SELECT id, name, build_lat, build_lng, geography_id, province_id, amphure_id, tambon_id
	FROM public.building_marker
  WHERE ${whereClause} 
  ORDER BY id ASC 
  LIMIT $2 OFFSET $3
  ;`;
    const search = searchWord ? `%${searchWord}%` : null;

    try {
      const result = await pool.query(query, [search, perPage, offset]);

      const data = result.rows;

      const totalCountQuery = ` SELECT COUNT(*) FROM public.building_marker  WHERE ${whereClause}`;
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
  /* Floor For Table */
  static async getFloorPage(building_id, page, perPage, searchWord) {
    const offset = (page - 1) * perPage;
    const whereClause = `(building_id = $1) AND (name ILIKE $2 OR $2 IS NULL)`;

    const query = `
        SELECT id, name, build_img, building_id, floor
        FROM public.building_floor
        WHERE ${whereClause}
        ORDER BY id ASC
        LIMIT $3 OFFSET $4;
    `;
    const search = searchWord ? `%${searchWord}%` : null;

    try {
      const result = await pool.query(query, [
        building_id,
        search,
        perPage,
        offset,
      ]);
      const data = result.rows;

      const totalCountQuery = `SELECT COUNT(*) FROM public.building_floor WHERE ${whereClause}`;
      const totalCountResult = await pool.query(totalCountQuery, [
        building_id,
        search,
      ]);
      const total = parseInt(totalCountResult.rows[0].count);

      const dataResult = data.map((row, index) => {
        const number = offset + index + 1;
        return {
          no: number,
          ...row,
        };
      });

      // Fetch building marker data
      const buildingMarkerQuery = `
            SELECT id, name, build_lat, build_lng
            FROM public.building_marker
            WHERE id = $1;
        `;
      const buildingMarkerResult = await pool.query(buildingMarkerQuery, [
        building_id,
      ]);
      const buildingMarker = buildingMarkerResult.rows[0];

      return {
        success: true,
        search,
        building_id,
        result: {
          page,
          perPage,
          totalPages: Math.ceil(total / perPage),
          total,
          building: buildingMarker,
          data: dataResult,
        },
      };
    } catch (error) {
      console.error("Error executing query", error);
      throw new Error("Internal server error");
    }
  }

  /* Bulid For map */
  static async getBuildOnMap() {
    const query = `
    SELECT id, name, build_lat, build_lng
	FROM public.building_marker`;

    const result = await pool.query(query);

    const totalCountQuery = `SELECT COUNT(*) FROM building_marker `;
    const totalCountResult = await pool.query(totalCountQuery);
    const total = parseInt(totalCountResult.rows[0].count);

    return { success: true, status: 200, total, data: result.rows };
  }
}

module.exports = { BulidingModel };
