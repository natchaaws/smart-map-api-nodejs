// src/services/modbusService.js

const ModbusModel = require('../models/modbusModel');

module.exports = {

    async createDevice(data) {
        // สร้างข้อมูล modbus_devices
        const device = await ModbusModel.createDevice(data);

        // ตรวจสอบและสร้าง modbus_messages ตาม length และ start
        const { length, start } = device;
        const modbusId = device.modbus_id;
        const createdBy = data.created_by;

        const messages = [];
        for (let i = 0; i < length; i++) {
            const name = "Modbus" + (start + i).toString();
            const count = (start + i);
            messages.push({
                name,
                message: "Close",
                x: null,
                y: null,
                length_count: count,
                modbus_id: modbusId,
                created_by: createdBy
            });
        }

        // สร้างข้อมูล modbus_messages
        const createdMessages = await ModbusModel.createMessagesBatch(messages);

        return {
            device,
            messages: createdMessages
        };
    },

    async getDevices(page, perPage, searchWord) {
        const offset = (page - 1) * perPage;
        const { totalItems, data } = await ModbusModel.getDevices(offset, perPage, searchWord);
        return {
            pagination: {
                page,
                perPage,
                totalPages: Math.ceil(totalItems / perPage),
                totalItems
            },
            data
        };
    },

    async getMessages(modbusId, page, perPage, searchWord) {
        const offset = (page - 1) * perPage;
        const { totalItems, data } = await ModbusModel.getMessagesByModbusId(modbusId, offset, perPage, searchWord);
        return {
            pagination: {
                page,
                perPage,
                totalPages: Math.ceil(totalItems / perPage),
                totalItems
            },
            data
        };
    },
    // สร้างข้อมูลใหม่ใน modbus_devices
    // async createDevice(data) {
    //     const device = await ModbusModel.createDevice(data);
    //     return device;
    // },

    // สร้างข้อมูลใหม่ใน modbus_messages
    async createMessage(data) {
        const message = await ModbusModel.createMessage(data);
        return message;
    },



    async updateStatus(modbusId, status, modifiedBy) {
        return await ModbusModel.updateStatus(modbusId, status, modifiedBy);
    },
    // async updateDevice(modbusId, data) {
    //     return await ModbusModel.updateDevice(modbusId, data);
    // },

    // async updateMessage(messageId, data) {
    //     return await ModbusModel.updateMessage(messageId, data);
    // },
    // ลบข้อมูล modbus_devices
    async deleteDevice(modbusId, deletedBy) {
        try {
            const deletedDevice = await ModbusModel.deleteDevice(modbusId, deletedBy);
            return deletedDevice;
        } catch (error) {
            throw new Error(`Failed to delete device: ${error.message}`);
        }
    },

    // ลบข้อมูล modbus_messages
    async deleteMessage(messageId, deletedBy) {
        try {
            const deletedMessage = await ModbusModel.deleteMessage(messageId, deletedBy);
            return deletedMessage;
        } catch (error) {
            throw new Error(`Failed to delete message: ${error.message}`);
        }
    },

    // --------- edit 2 ----------------- 

    async updateDevice(modbusId, data) {
        const oldDevice = await ModbusModel.getDeviceById(modbusId);
        const updatedDevice = await ModbusModel.updateDevice(modbusId, data);

        const oldLength = oldDevice.length;

        const newLength = data.length;

        const oldStart = oldDevice.start;

        const newStart = data.start;

        const modifiedBy = data.modified_by;

        console.log("🚀 ~ updateDevice ~ old:", oldLength, oldStart)

        console.log("🚀 ~ updateDevice ~ oldStart:", oldStart)
        console.log("🚀 ~ updateDevice ~ newLength:", newLength)
        console.log("🚀 ~ updateDevice ~ newStart:", newStart)
        // ตรวจสอบว่าไม่มีการเปลี่ยนแปลงของ length และ start
        if (oldLength === newLength && oldStart === newStart) {
            return updatedDevice;
        }

        // กรณีที่ length เก่าไม่เท่ากับ length ใหม่
        if (oldLength !== newLength) {
            if (oldLength > newLength) {
                // ลบ modbus_messages ตัวท้ายสุด
                const countToDelete = oldLength - newLength;
                await ModbusModel.deleteLastMessages(modbusId, countToDelete);

                // อัปเดต length_count ถ้า start เปลี่ยน
                if (oldStart !== newStart) {
                    await ModbusModel.updateMessagesStart(modbusId, newStart);
                }
            } else {
                // เพิ่ม modbus_messages ตัวใหม่
                const countToAdd = newLength - oldLength;
                await this.addMessages(modbusId, newStart, oldLength, newLength, modifiedBy);

                // อัปเดต length_count ถ้า start เปลี่ยน
                if (oldStart !== newStart) {
                    await ModbusModel.updateMessagesStart(modbusId, newStart);
                }
            }
        }

        // กรณีที่ length ไม่เปลี่ยน แต่ start เปลี่ยน
        if (oldStart !== newStart && oldLength === newLength) {
            await ModbusModel.updateMessagesStart(modbusId, newStart);
        }

        return updatedDevice;
    },
    async updateMessage(messageId, data) {
        const existingMessage = await ModbusModel.getMessageById(messageId);

        // ตรวจสอบการเปลี่ยนแปลงของ length_count
        if (existingMessage.length_count !== data.length_count) {
            data.modified_date = new Date();
        }

        return await ModbusModel.updateMessage(messageId, data);
    },


    async addMessages(modbusId, start, oldLength, newLength, createdBy) {
        const messages = [];
        for (let i = oldLength; i < newLength; i++) {
            const name = "Modbus" + (start + i).toString();
            const length_count = start + i;
            messages.push({
                name,
                message: "Close",
                x: null,
                y: null,
                length_count,
                modbus_id: modbusId,
                created_by: createdBy
            });
        }
        return await ModbusModel.createMessagesBatch(messages);
    }

};


