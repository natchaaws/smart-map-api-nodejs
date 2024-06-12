const pool = require("../config/database");

const getRole = async () => {
  const query = `SELECT id, name FROM public.role`;
  const { rows } = await pool.query(query);
  return rows;
};

const getPermis = async (role_id) => {
  const id = role_id;
  const query = `
        SELECT 
        pr.role_id, 
        r.name AS role_name,
        pr.permission_id, 
        p.name AS permission_name, 
        p.description, 
        pr.view, 
        pr.add, 
        pr.edit, 
        pr.delete
    FROM 
        public.permissions_role pr
        
    JOIN 
        public.role r ON pr.role_id = r.id
    JOIN 
        public.permissions p ON pr.permission_id = p.permission_id
        where pr.role_id = $1;`;

  const result = await pool.query(query, [id]);
  const data = result.rows;
  const totalCountQuery = `SELECT COUNT(*) FROM 
        public.permissions_role pr
            
        JOIN 
            public.role r ON pr.role_id = r.id
        JOIN 
            public.permissions p ON pr.permission_id = p.permission_id
        where pr.role_id = $1;`;
  const totalCountResult = await pool.query(totalCountQuery, [id]);
  const total = parseInt(totalCountResult.rows[0].count);
  return { success: true, status: 200, total, data: data };
};

module.exports = { getRole, getPermis };
