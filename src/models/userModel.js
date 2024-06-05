const pool = require("../config/database");


const getUserByUsername = async (username) => {
  const query = "SELECT * FROM users WHERE username = $1 AND is_delete = false";
  const { rows } = await pool.query(query, [username]);
  return rows[0];
};

const createUser = async (username, hashedPassword, role_id, created_by) => {
  const query = `
    INSERT INTO users (username, password, role_id, created_by)
    VALUES ($1, $2, $3, $4) RETURNING user_id
  `;
  const { rows } = await pool.query(query, [
    username,
    hashedPassword,
    role_id,
    created_by,
  ]);
  return rows[0].user_id;
};

const getUserById = async (user_id) => {
    const query = "SELECT * FROM users WHERE user_id = $1";
    const { rows } = await pool.query(query, [user_id]);
    return rows[0];
  };

module.exports = {
  getUserByUsername,
  createUser,
  getUserById,
};
