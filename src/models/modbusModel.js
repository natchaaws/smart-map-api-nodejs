// src/models/modbusModel.js

const pool = require('../config/database');


module.exports = {
    // สร้างข้อมูล modbus_messages แบบหลายรายการ
    async createMessagesBatch(messages) {
        const query = `
        INSERT INTO public.modbus_messages (name, message,length_count, x, y, modbus_id, created_by, created_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *
    `;

        const results = [];
        for (const msg of messages) {
            const values = [msg.name, msg.message, msg.length_count, msg.x, msg.y, msg.modbus_id, msg.created_by];
            const result = await pool.query(query, values);
            results.push(result.rows[0]);
        }

        return results;
    },


    // ดึงข้อมูล modbus_devices แบบแบ่งหน้าและนับจำนวนข้อมูล
    async getDevices(offset, perPage, searchWord) {
        try {
            const countQuery = `
                SELECT COUNT(*) AS total 
                FROM public.modbus_devices 
                WHERE is_delete = false 
                AND (modbus_ip ILIKE $1 OR  CAST(websocket_type AS TEXT) ILIKE $1)
            `;
            const dataQuery = `
                SELECT modbus_id, modbus_ip, port, websocket_type, length, start, status, image, created_by, created_date, modified_by, modified_date, deleted_by, deleted_date, is_delete 
                FROM public.modbus_devices 
                WHERE is_delete = false 
                AND (modbus_ip ILIKE $1 OR CAST(websocket_type AS TEXT) ILIKE $1)
                ORDER BY created_date DESC 
                LIMIT $2 OFFSET $3
            `;
            const countResult = await pool.query(countQuery, [`%${searchWord}%`]);
            const dataResult = await pool.query(dataQuery, [`%${searchWord}%`, perPage, offset]);

            const totalItems = parseInt(countResult.rows[0].total, 10);
            return { totalItems, data: dataResult.rows };
        } catch (error) {
            throw new Error(`Database Error: ${error.message}`);
        }
    },


    // ดึงข้อมูล modbus_messages แบบแบ่งหน้าและนับจำนวนข้อมูล
    async getMessagesByModbusId(modbusId, offset, perPage, searchWord) {
        try {
            const countQuery = `
                SELECT COUNT(*) AS total 
                FROM public.modbus_messages 
                WHERE is_delete = false 
                AND modbus_id = $1 
                AND (name ILIKE $2 OR message ILIKE $2)
            `;
            const dataQuery = `
                SELECT 
                    id, name, message,length_count, x, y, modbus_id, 
                    created_by, created_date, 
                    modified_by, modified_date, 
                    deleted_by, deleted_date, 
                    is_delete
                FROM public.modbus_messages 
                WHERE is_delete = false 
                AND modbus_id = $1 
                AND (name ILIKE $2 OR message ILIKE $2)
                ORDER BY id ASC 
                LIMIT $3 OFFSET $4
            `;
            const countResult = await pool.query(countQuery, [modbusId, `%${searchWord}%`]);
            const dataResult = await pool.query(dataQuery, [modbusId, `%${searchWord}%`, perPage, offset]);

            const totalItems = parseInt(countResult.rows[0].total, 10);
            return { totalItems, data: dataResult.rows };
        } catch (error) {
            throw new Error(`Database Error: ${error.message}`);
        }
    },

    // เพิ่มข้อมูล modbus_devices
    async createDevice(data) {
        const query = `
        INSERT INTO public.modbus_devices (modbus_ip, port, websocket_type, length, start, status, image, created_by, created_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING *
    `;
        const values = [
            data.modbus_ip,
            data.port,
            data.websocket_type,
            data.length,
            data.start,
            data.status,
            data.image,
            data.created_by
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // เพิ่มข้อมูล modbus_messages
    async createMessage(data) {
        const query = `
        INSERT INTO public.modbus_messages (name, message,length_count, x, y, modbus_id, created_by, created_date)
        VALUES ($1, $2, $3, $4, $5, $6,$7, NOW())
        RETURNING *
    `;
        const values = [data.name, data.message, data.length_count, data.x, data.y, data.modbus_id, data.created_by];
        const result = await pool.query(query, values);
        return result.rows[0];
    },


    // ฟังก์ชันอัปเดตสถานะ modbus_devices
    async updateStatus(modbusId, status, modifiedBy) {
        const query = `
        UPDATE public.modbus_devices
        SET 
            status = $1,
            modified_by = $2,
            modified_date = NOW()
        WHERE modbus_id = $3 AND is_delete = false
        RETURNING *
    `;
        const values = [status, modifiedBy, modbusId];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('Modbus device not found or already deleted');
        }

        return result.rows[0];
    },
    // แก้ไขข้อมูล modbus_devices
    async updateDevice(modbusId, data) {
        const query = `
            UPDATE public.modbus_devices 
            SET 
                modbus_ip = $1, 
                port = $2, 
                websocket_type = $3, 
                length = $4, 
                start = $5, 
                status = $6, 
                image = $7, 
                modified_by = $8, 
                modified_date = NOW()
            WHERE modbus_id = $9
            RETURNING *
        `;
        const values = [
            data.modbus_ip,
            data.port,
            data.websocket_type,
            data.length,
            data.start,
            data.status,
            data.image,
            data.modified_by,
            modbusId
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // แก้ไขข้อมูล modbus_messages
    // async updateMessage(messageId, data) {
    //     const query = `
    //         UPDATE public.modbus_messages 
    //         SET 
    //             name = $1, 
    //             message = $2, 
    //             length_count = $3
    //             x = $4, 
    //             y = $5, 
    //             modified_by = $6, 
    //             modified_date = NOW()
    //         WHERE id = $7
    //         RETURNING *
    //     `;
    //     const values = [data.name, data.message, data.length_count, data.x, data.y, data.modified_by, messageId];
    //     const result = await pool.query(query, values);
    //     return result.rows[0];
    // },

    // ลบข้อมูล modbus_devices (soft delete)
    async deleteDevice(modbusId, deletedBy) {
        // ตรวจสอบก่อนว่าข้อมูลถูกลบไปแล้วหรือยัง
        const checkQuery = `
            SELECT is_delete 
            FROM public.modbus_devices 
            WHERE modbus_id = $1
        `;
        const checkResult = await pool.query(checkQuery, [modbusId]);

        if (checkResult.rows.length === 0) {
            throw new Error('Device not found');
        }

        if (checkResult.rows[0].is_delete === true) {
            throw new Error('Device already deleted');
        }

        // อัปเดตข้อมูลเป็น is_delete = true
        const deleteQuery = `
            UPDATE public.modbus_devices 
            SET 
                is_delete = true, 
                deleted_by = $1, 
                deleted_date = NOW()
            WHERE modbus_id = $2
            RETURNING modbus_id
        `;
        const values = [deletedBy, modbusId];
        const result = await pool.query(deleteQuery, values);

        return result.rows[0];
    },

    // ลบข้อมูล modbus_messages (soft delete)
    async deleteMessage(messageId, deletedBy) {
        // ตรวจสอบก่อนว่าข้อมูลถูกลบไปแล้วหรือยัง
        const checkQuery = `
            SELECT is_delete 
            FROM public.modbus_messages 
            WHERE id = $1
        `;
        const checkResult = await pool.query(checkQuery, [messageId]);

        if (checkResult.rows.length === 0) {
            throw new Error('Message not found');
        }

        if (checkResult.rows[0].is_delete === true) {
            throw new Error('Message already deleted');
        }

        // อัปเดตข้อมูลเป็น is_delete = true
        const deleteQuery = `
            UPDATE public.modbus_messages 
            SET 
                is_delete = true, 
                deleted_by = $1, 
                deleted_date = NOW()
            WHERE id = $2
            RETURNING id
        `;
        const values = [deletedBy, messageId];
        const result = await pool.query(deleteQuery, values);

        return result.rows[0];
    },


    // --------- edit 2 ----------------- 
    // ฟังก์ชันดึงข้อมูล modbus_devices โดยใช้ modbus_id
    async getDeviceById(modbusId) {
        const query = `
        SELECT * 
        FROM public.modbus_devices 
        WHERE modbus_id = $1 AND is_delete = false
    `;
        const result = await pool.query(query, [modbusId]);
        if (result.rows.length === 0) {
            throw new Error('Modbus device not found');
        }
        return result.rows[0];
    },


    // ฟังก์ชันลบ modbus_messages ตัวท้ายสุด
    async deleteLastMessages(modbusId, count) {
        const query = `
            DELETE FROM public.modbus_messages
            WHERE modbus_id = $1
            AND id IN (
                SELECT id FROM public.modbus_messages
                WHERE modbus_id = $1
                ORDER BY length_count DESC
                LIMIT $2
            )
        `;
        await pool.query(query, [modbusId, count]);
    }
    ,

    // ฟังก์ชันเพิ่ม modbus_messages ตัวใหม่
    // async addMessages(modbusId, start, oldLength, newLength, createdBy) {
    //     const messages = [];
    //     for (let i = oldLength; i < newLength; i++) {
    //         const name = "Modbus" + (start + i).toString();
    //         const length_count = start + i;
    //         messages.push({
    //             name,
    //             message: "Close",
    //             x: null,
    //             y: null,
    //             length_count,
    //             modbus_id: modbusId,
    //             created_by: createdBy
    //         });
    //     }
    //     return await this.createMessagesBatch(messages);
    // },
    // ฟังก์ชันอัปเดต length_count ตามค่า start ใหม่ โดยใช้ CTE
    async updateMessagesStart(modbusId, newStart) {
        const query = `
        WITH ranked_messages AS (
            SELECT 
                id,
                $1 + ROW_NUMBER() OVER (ORDER BY id) - 1 AS new_length_count
            FROM 
                public.modbus_messages
            WHERE 
                modbus_id = $2
        )
        UPDATE 
            public.modbus_messages AS mm
        SET 
            length_count = rm.new_length_count,
            name = 'Modbus' || rm.new_length_count::text
        FROM 
            ranked_messages AS rm
        WHERE 
            mm.id = rm.id;
    `;
        await pool.query(query, [newStart, modbusId]);
    }


};


