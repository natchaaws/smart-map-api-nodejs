const pool = require("../config/database");

class BulidingModel {
  /* BulidMarker */

  static async createBulidMarker(buildValues) {
    const { name, build_lat, build_lng, geography_id, province_id, amphure_id, tambon_id, created_by } = buildValues;
    const query = `
    INSERT INTO public.building_marker(
        name, 
        build_lat, build_lng,
        geography_id, province_id, 
        amphure_id, tambon_id, created_by)
    VALUES 
        ($1, $2, $3, $4 ,$5 , $6 ,$7, $8);`;
    const values = [name, build_lat, build_lng, geography_id, province_id, amphure_id, tambon_id, created_by];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async editBulidMarker(buildValues) {
    const { name, build_lat, build_lng, geography_id, province_id, amphure_id, tambon_id, modified_by, id } =
      buildValues;
    const query = `
        UPDATE public.building_marker
            SET
            name = $1, 
            build_lat = $2, 
            build_lng = $3,
            geography_id = $4, province_id = $5, 
            amphure_id = $6, tambon_id = $7,  
            modified_by= $8, 
            modified_date= NOW()
        WHERE id = $9 RETURNING id
   `;
    const values = [name, build_lat, build_lng, geography_id, province_id, amphure_id, tambon_id, modified_by, id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteBulidMarker(deleted_by, id) {
    // Check if user exists
    const userCheckQuery = "SELECT id, name FROM building_marker WHERE id = $1";
    const userCheckResult = await pool.query(userCheckQuery, [id]);

    if (userCheckResult.rowCount === 0) {
      throw new Error("Building marker not found");
    }

    const query = `
        UPDATE building_marker 
        SET is_delete = true ,deleted_by= $1, deleted_date= NOW()
    WHERE id = $2
    RETURNING id, is_delete; `;
    const { rows } = await pool.query(query, [deleted_by, id]);
    return rows[0];
  }

  /* BulidFloor */
  static async createBulidFloor(floorValues) {
    const { name, floor, build_img, created_by, building_id } = floorValues;
    const query = `
    INSERT INTO public.building_floor(
        name, 
        floor,
        build_img,created_by, building_id)
        VALUES ($1, $2, $3 ,$4,$5);`;
    const values = [name, floor, build_img, created_by, building_id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async editBulidFloor(floorValues) {
    const { name, floor, build_img, building_id, modified_by, id } = floorValues;
    const query = `
        UPDATE public.building_floor
            SET
            name = $1, 
            floor = $2, 
            build_img = $3,
           building_id = $4,  modified_by= $5, 
           
            modified_date= NOW()
        WHERE id = $6 
        RETURNING id
   `;
    const values = [name, floor, build_img, building_id, modified_by, id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /* LocationFloor */
  static async createLocationFloor(LocationfloorValues) {
    const { camera_name, rtsp_path, position_x, position_y, floor_id, created_by } = LocationfloorValues;
    const query = `
    INSERT INTO public.building_location_onfloor(
        camera_name, rtsp_path, position_x, position_y, floor_id, created_by)
        VALUES ($1, $2, $3, $4, $5, $6);`;
    const values = [camera_name, rtsp_path, position_x, position_y, floor_id, created_by];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async editLocationFloor(LocationfloorValues) {
    const { camera_name, rtsp_path, position_x, position_y, floor_id, modified_by, id } = LocationfloorValues;
    const query = `
        UPDATE public.building_location_onfloor
            SET
            camera_name = $1, 
            rtsp_path = $2, 
            position_x = $3,
            position_y = $4, 
            floor_id= $5,
            modified_by = $6, 
            modified_date = NOW()
        WHERE id = $7 
        RETURNING id
   `;
    const values = [camera_name, rtsp_path, position_x, position_y, floor_id, modified_by, id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /* Bulid For Table */
  static async getBulidPage(page, perPage, searchWord) {
    const offset = (page - 1) * perPage;
    const whereClause = `(name ILIKE $1 OR $1 IS NULL)`;

    const query = `SELECT id, name, build_lat, build_lng,
     geography_id, province_id, amphure_id, tambon_id,
     created_by, created_date, modified_by, modified_date, deleted_by, deleted_date
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
          ...row
        };
      });
      return {
        success: true,
        status: 200,

        result: {
          pagination: {
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
            totalItems: total
          },
          search: {
            search
          },

          data: dataResult
        }
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
      const result = await pool.query(query, [building_id, search, perPage, offset]);
      const data = result.rows;

      const totalCountQuery = `SELECT COUNT(*) FROM public.building_floor WHERE ${whereClause}`;
      const totalCountResult = await pool.query(totalCountQuery, [building_id, search]);
      const total = parseInt(totalCountResult.rows[0].count);

      const dataResult = data.map((row, index) => {
        const number = offset + index + 1;
        return {
          no: number,
          ...row
        };
      });

      // Fetch building marker data
      const buildingMarkerQuery = `
            SELECT id, name, build_lat, build_lng
            FROM public.building_marker
            WHERE id = $1;
        `;
      const buildingMarkerResult = await pool.query(buildingMarkerQuery, [building_id]);
      const buildingMarker = buildingMarkerResult.rows[0];

      return {
        success: true,
        status: 200,

        result: {
          pagination: {
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
            totalItems: total
          },
          search: {
            search
          },
          building_id,
          building: buildingMarker,
          data: dataResult
        }
      };
    } catch (error) {
      console.error("Error executing query", error);
      throw new Error("Internal server error");
    }
  }

  /* Location For Table */
  static async getLocationPage(floor_id, page, perPage, searchWord) {
    const offset = (page - 1) * perPage;
    const whereClause = `(floor_id = $1) AND (camera_name ILIKE $2 OR $2 IS NULL)`;

    const query = `
    SELECT id, camera_name, rtsp_path, position_x, position_y, floor_id,created_by, created_date, modified_by, modified_date, deleted_by, deleted_date
    FROM public.building_location_onfloor
        WHERE ${whereClause} AND is_delete = 'false'
        ORDER BY id ASC
        LIMIT $3 OFFSET $4;
    `;
    const search = searchWord ? `%${searchWord}%` : null;

    try {
      const result = await pool.query(query, [floor_id, search, perPage, offset]);
      const data = result.rows;

      const totalCountQuery = `SELECT COUNT(*) FROM public.building_location_onfloor WHERE ${whereClause}`;
      const totalCountResult = await pool.query(totalCountQuery, [floor_id, search]);
      const total = parseInt(totalCountResult.rows[0].count);

      const dataResult = data.map((row, index) => {
        const number = offset + index + 1;
        return {
          no: number,
          ...row
        };
      });

      // Fetch building marker data
      const buildingMarkerQuery = `
      SELECT bf.id, bf.name,  bf.floor,
      bm.id AS building_id, bm.name AS building_name
        FROM public.building_floor AS bf
        JOIN public.building_marker AS bm ON bf.building_id = bm.id
        WHERE bf.id = $1;
        `;
      const buildingMarkerResult = await pool.query(buildingMarkerQuery, [floor_id]);
      const buildingMarker = buildingMarkerResult.rows[0];

      return {
        success: true,
        status: 200,

        result: {
          pagination: {
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
            totalItems: total
          },
          search: {
            search
          },
          floor_id,
          building: buildingMarker,
          data: dataResult
        }
      };
    } catch (error) {
      console.error("Error executing query", error);
      throw new Error("Internal server error");
    }
  }

  /* Floor show Image */
  static async getImgByFloorId(floor_id) {
    const query = `
    SELECT id, name, build_img, building_id, floor
	FROM public.building_floor
    WHERE id =$1`;

    const result = await pool.query(query, [floor_id]);

    return { success: true, status: 200, data: result.rows[0] };
  }

  /* Floor  Position  show Image */
  static async getPositionByFloorId(floor_id) {
    const query = `
    SELECT id, name, build_img, building_id, floor
    FROM public.building_floor
    WHERE id =$1`;

    const result = await pool.query(query, [floor_id]);

    const queryLocation = `
        SELECT id, camera_name, rtsp_path, position_x, position_y, floor_id
        FROM public.building_location_onfloor
        where floor_id =$1`;
    const resultLocation = await pool.query(queryLocation, [floor_id]);

    return {
      success: true,
      status: 200,
      data: { building: result.rows[0], location: resultLocation.rows }
    };
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

  static async getFloorSelect(building_id) {
    const query = `
    SELECT 
      floor,id, name,  
      building_id
    FROM public.building_floor
    WHERE building_id = $1
      order by floor asc
        ;`;

    const result = await pool.query(query, [building_id]);

    const totalCountQuery = `SELECT COUNT(*) FROM public.building_floor WHERE building_id = $1 `;
    const totalCountResult = await pool.query(totalCountQuery, [building_id]);
    const total = parseInt(totalCountResult.rows[0].count);

    return { success: true, status: 200, total, data: result.rows };
  }
}

module.exports = { BulidingModel };
