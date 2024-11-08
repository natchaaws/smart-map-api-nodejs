// src\models\websocketModel.js
const pool = require('../config/database')


module.exports = {
    async getPaginatedEvents(offset, limit, filters) {
        const { startDate, endDate, ports, bodySearch } = filters;
        let query = `
            SELECT event_id, port_id, port, camera_map_id, device, title, body, img, description, created_date
            FROM public.websocket_event
            WHERE created_date BETWEEN $1 AND $2
        `;
        const values = [startDate, endDate];

        if (ports.length) {
            query += ` AND port = ANY($3::int[])`;
            values.push(ports);
        }

        if (bodySearch.length) {
            bodySearch.forEach((search) => {
                const [key, value] = Object.entries(search)[0]; // Get key and value

                if (value === null) {
                    // Search only by key existence
                    query += ` AND body ? $${values.length + 1}`; // Check if key exists
                    values.push(key);
                } else {
                     // Search by key-value pair with ILIKE
                     query += ` AND body->>$${values.length + 1} ILIKE $${values.length + 2}`;
                     values.push(key, `%${value}%`);
                    // // Search by key-value pair
                    // query += ` AND body @> $${values.length + 1}::jsonb`;
                    // values.push(JSON.stringify(search));
                }
            });
        }


        query += ` ORDER BY created_date DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limit, offset);

        const result = await pool.query(query, values);
        return result.rows;
    },

    async getTotalCount(filters) {
        const { startDate, endDate, ports, bodySearch } = filters;
        let query = `
            SELECT COUNT(*) FROM public.websocket_event
            WHERE created_date BETWEEN $1 AND $2
        `;
        const values = [startDate, endDate];

        if (ports.length) {
            query += ` AND port = ANY($3::int[])`;
            values.push(ports);
        }

        if (bodySearch.length) {
            bodySearch.forEach((search) => {
                const [key, value] = Object.entries(search)[0]; // Get key and value

                if (value === null) {
                    // Search only by key existence
                    query += ` AND body ? $${values.length + 1}`; // Check if key exists
                    values.push(key);
                } else {
                    // Search by key-value pair with ILIKE
                query += ` AND body->>$${values.length + 1} ILIKE $${values.length + 2}`;
                values.push(key, `%${value}%`);
                }
            });
        }

        const result = await pool.query(query, values);
        return parseInt(result.rows[0].count, 10);
    },

    async getDistinctBodyFields() {
        const query = `
          SELECT DISTINCT unnest(body_fields) AS body
          FROM public.websocket_ports 
          WHERE body_fields IS NOT NULL 
          AND is_delete = 'false' 
          ORDER BY  body ;
        `;
        const result = await pool.query(query);
        return result.rows.map(row => row.body);
    },
    async getDistinctPorts() {
        const query = `
          SELECT DISTINCT port, header
            FROM public.websocket_ports
            WHERE is_delete = 'false'
            ORDER BY port;

        `;
        const result = await pool.query(query);
        return result.rows
    },

    async getDistinctHeaders() {
        const query = `
          SELECT DISTINCT header 
          FROM public.websocket_ports 
          WHERE is_delete = 'false' 
          ORDER BY header;
        `;
        const result = await pool.query(query);
        return result.rows.map(row => row.header); // Return only the header values
    }
};