// src/controllers/modbusController.js

const ModbusService = require('../services/modbusService');

module.exports = {
    // ดึงข้อมูล modbus_devices แบบแบ่งหน้า
    async getDevices(req, res) {
        const page = parseInt(req.body.page) || 1;
        const perPage = parseInt(req.body.perPage) || 10;
        const searchWord = req.body.searchWord || '';

        try {
            const result = await ModbusService.getDevices(page, perPage, searchWord);
            res.status(200).json({
                success: true,
                status: 200,
                message: 'OK',
                result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                status: 500,
                message: 'Internal Server Error',
                error: error.message
            });
        }
    },
    // ดึงข้อมูล modbus_messages แบบแบ่งหน้า
    async getMessages(req, res) {
        const { modbusId } = req.params;
        const page = parseInt(req.body.page) || 1;
        const perPage = parseInt(req.body.perPage) || 10;
        const searchWord = req.body.searchWord || '';

        try {
            const result = await ModbusService.getMessages(modbusId, page, perPage, searchWord);
            res.status(200).json({
                success: true,
                status: 200,
                message: 'OK',
                result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                status: 500,
                message: 'Internal Server Error',
                error: error.message
            });
        }
    },

    // สร้างข้อมูลใหม่ใน modbus_devices
    async createDevice(req, res) {
        try {
            const createdBy = req.userData.username;
            const data = {
                ...req.body,
                created_by: createdBy
            };
            const result = await ModbusService.createDevice(data);

            res.status(201).json({
                success: true,
                status: 201,
                message: "Device and messages created successfully",
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                status: 500,
                message: 'Internal Server Error',
                error: error.message
            });
        }
    },

    // async createDevice(req, res) {
    //     try {
    //         const createdBy = req.userData.username; // รับค่า created_by จาก req.userData
    //         const data = {
    //             ...req.body,
    //             created_by: createdBy
    //         };
    //         const device = await ModbusService.createDevice(data);
    //         res.status(201).json({
    //             success: true,
    //             status: 201,
    //             message: "Device created successfully",
    //             data: device
    //         });
    //     } catch (error) {
    //         res.status(500).json({
    //             success: false,
    //             status: 500,
    //             message: 'Internal Server Error',
    //             error: error.message
    //         });
    //     }
    // },

    // สร้างข้อมูลใหม่ใน modbus_messages
    async createMessage(req, res) {
        try {
            const createdBy = req.userData.username; // รับค่า created_by จาก req.userData
            const data = {
                ...req.body,
                created_by: createdBy
            };
            const message = await ModbusService.createMessage(data);
            res.status(201).json({
                success: true,
                status: 201,
                message: "Modbus message created successfully",
                data: message
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                status: 500,
                message: 'Internal Server Error',
                error: error.message
            });
        }
    },

    async updateStatus(req, res) {
        const { modbusId } = req.params;
        const { status } = req.body;
        const modifiedBy = req.userData.username;

        try {
            const updatedDevice = await ModbusService.updateStatus(modbusId, status, modifiedBy);
            res.status(200).json({
                success: true,
                status: 200,
                message: 'Modbus device status updated successfully',
                data: updatedDevice
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                status: 400,
                message: 'Failed to update modbus device status',
                error: error.message
            });
        }
    },

    // อัปเดตข้อมูลใน modbus_devices
    async updateDevice(req, res) {
        const { modbusId } = req.params;
        const modifiedBy = req.userData.username;

        try {
            const data = { ...req.body, modified_by: modifiedBy };
            const updatedDevice = await ModbusService.updateDevice(modbusId, data);

            res.status(200).json({
                success: true,
                status: 200,
                message: 'Modbus device updated successfully',
                data: updatedDevice
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                status: 400,
                message: 'Failed to update modbus device',
                error: error.message
            });
        }
    },

    // อัปเดตข้อมูลใน modbus_messages
    async updateMessage(req, res) {
        const { messageId } = req.params;
        const modifiedBy = req.userData.username;

        try {
            const data = { ...req.body, modified_by: modifiedBy };
            const updatedMessage = await ModbusService.updateMessage(messageId, data);

            res.status(200).json({
                success: true,
                status: 200,
                message: 'Modbus message updated successfully',
                data: updatedMessage
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                status: 400,
                message: 'Failed to update message',
                error: error.message
            });
        }
    },
    // ลบข้อมูล modbus_devices
    async deleteDevice(req, res) {
        const { modbusId } = req.params;
        const deletedBy = req.userData.username;

        try {
            const deletedDevice = await ModbusService.deleteDevice(modbusId, deletedBy);
            res.status(200).json({
                success: true,
                status: 200,
                message: 'Modbus device deleted successfully',
                data: deletedDevice
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                status: 400,
                message: 'Failed to delete device',
                error: error.message
            });
        }
    },

    // ลบข้อมูล modbus_messages
    async deleteMessage(req, res) {
        const { messageId } = req.params;
        const deletedBy = req.userData.username;

        try {
            const deletedMessage = await ModbusService.deleteMessage(messageId, deletedBy);
            res.status(200).json({
                success: true,
                status: 200,
                message: 'Modbus message deleted successfully',
                data: deletedMessage
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                status: 400,
                message: 'Failed to delete modbus message',
                error: error.message
            });
        }
    },

    // -----------------edit 2 -----------------

    async updateDevice(req, res) {
        const { modbusId } = req.params;
        const modifiedBy = req.userData.username;

        try {
            const data = { ...req.body, modified_by: modifiedBy };
            const updatedDevice = await ModbusService.updateDevice(modbusId, data);

            res.status(200).json({
                success: true,
                status: 200,
                message: 'Modbus device updated successfully',
                data: updatedDevice
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                status: 400,
                message: 'Failed to update modbus device',
                error: error.message
            });
        }
    }
};
