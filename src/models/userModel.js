// src/models/userModel.js

const pool = require("../config/database");
class usersModel {
  static async getUserByUsername(username) {
    const query = "SELECT * FROM users WHERE username = $1 AND is_delete = false";
    const values = [username];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async createUser(name, lastname, tel, email, username, hashedPassword, role_id, created_by) {
    const query = `
    INSERT INTO users (name,lastname,tel,
    email,username, password, role_id, created_by)
    VALUES ($1, $2, $3, $4,$5, $6, $7, $8) RETURNING user_id
  `;
    const values = [name, lastname, tel, email, username, hashedPassword, role_id, created_by];
    const { rows } = await pool.query(query, values);
    return rows[0].user_id;
  }

  static async getUserById(user_id) {
    const query = "SELECT * FROM users WHERE user_id = $1";
    const values = [user_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getUser(user_id) {
    const query = `SELECT 
    u.user_id, 
    u.username, 
    u.name, 
    u.lastname, 
    u.tel, 
    u.email, 
    u.role_id,  r.name AS role_name,
    u.is_delete
   
FROM 
    public.users u
JOIN 
    public.role r
ON 
    u.role_id = r.id
WHERE 
    u.user_id = $1 
    AND u.is_delete = false;
`;

    const values = [user_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllUser(userValues) {
    const { page, perPage, searchWord, searchRole } = userValues;
    const offset = (page - 1) * perPage;
    const whereClause = `
    ((u.username ILIKE $1 OR $1 IS NULL) OR
    (u.name ILIKE $1 OR $1 IS NULL) OR
    (u.lastname ILIKE $1 OR $1 IS NULL) OR
    (u.tel ILIKE $1 OR $1 IS NULL) OR
    (u.email ILIKE $1 OR $1 IS NULL))
`;

    const whereRole = `(u.role_id = $2 OR $2 IS NULL)`;

    const query = `SELECT 
          u.user_id, 
          u.username, 
          u.name, 
          u.lastname, 
          u.tel, 
          u.email, 
          u.role_id,  r.name AS role_name,
          u.is_delete
        FROM  
          public.users u
        JOIN 
          public.role r
        ON 
          u.role_id = r.id
        WHERE 
          ${whereClause} AND  ${whereRole} 
       ORDER BY  
          u.is_delete ASC, u.user_id ASC  LIMIT $3 OFFSET $4;  `;

    const search = searchWord ? `%${searchWord}%` : null;
    const search_role = searchRole || null;
    try {
      const values = [search, search_role, perPage, offset];
      const result = await pool.query(query, values);
      const data = result.rows;

      const totalCountQuery = `SELECT COUNT(*)
        FROM  
          public.users u
        JOIN 
          public.role r
        ON 
          u.role_id = r.id
        WHERE 
          ${whereClause} AND  ${whereRole} 
      `;
      const searchValues = [search, search_role];
      const totalCountResult = await pool.query(totalCountQuery, searchValues);
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
            search,
            roleType: search_role
          },
          data: dataResult
        }
      };
    } catch (error) {
      console.error("Error executing query", error);
      throw new Error("Internal server error");
    }
  }

  static async editUserRole(user_id, newRole) {
    // Check if user and role exist
    const userCheckQuery = "SELECT * FROM users WHERE user_id = $1";
    const roleCheckQuery = "SELECT * FROM role WHERE id = $1";
    const userCheckValues = [user_id];
    const roleCheckValues = [newRole];
    const userCheckResult = await pool.query(userCheckQuery, userCheckValues);
    const roleCheckResult = await pool.query(roleCheckQuery, roleCheckValues);

    if (userCheckResult.rowCount === 0) {
      throw new Error("User not found");
    }

    if (roleCheckResult.rowCount === 0) {
      throw new Error("Role not found");
    }

    const query = `
      UPDATE users 
      SET role_id = $1 
      WHERE user_id = $2 AND is_delete = false 
      RETURNING user_id, role_id;
    `;
    const values = [newRole, user_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async deleteUser(user_id) {
    // Check if user exists
    const userCheckQuery = "SELECT * FROM users WHERE user_id = $1";
    const userCheckValues = [user_id];
    const userCheckResult = await pool.query(userCheckQuery, userCheckValues);

    if (userCheckResult.rowCount === 0) {
      throw new Error("User not found");
    }

    const query = `
      UPDATE users 
      SET is_delete = true 
      WHERE user_id = $1 
      RETURNING user_id, is_delete;
    `;
    const values = [user_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}
module.exports = usersModel;
