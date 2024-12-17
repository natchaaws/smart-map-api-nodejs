// src/services/modbusService.js

const ModbusModel = require("../models/modbusModel");

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
      const count = start + i;
      messages.push({
        name,
        message: "off",
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

    // แปลง length_count ให้เป็นเลข 6 หลัก
    const transformedData = data.map((row) => ({
      ...row,
      length_count: row.length_count.toString().padStart(6, "0") // แปลง length_count
    }));
    return {
      pagination: {
        page,
        perPage,
        totalPages: Math.ceil(totalItems / perPage),
        totalItems
      },
      data: transformedData
    };
  },

  // สร้างข้อมูลใหม่ใน modbus_messages
  async createMessage(data) {
    const message = await ModbusModel.createMessage(data);
    return message;
  },

  async updateStatus(modbusId, status, modifiedBy) {
    return await ModbusModel.updateStatus(modbusId, status, modifiedBy);
  },

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

  // --------- edit 2 Messages-----------------

  //   async updateDevice(modbusId, data) {
  //     const countMessages = await ModbusModel.countMessagesByModbusId(modbusId);
  //     console.log("🚀 ~ updateDevice ~ cocountMessages:", countMessages);
  //     // ดึงข้อมูลเก่าของ modbus_device
  //     const oldDevice = await ModbusModel.getDeviceById(modbusId);
  //     console.log("🚀 ~ updateDevice ~ oldDevice =:", oldDevice.length);
  //     if (!oldDevice) throw new Error("Modbus device not found");
  //     // อัปเดตข้อมูลในฐานข้อมูล
  //     const updatedDevice = await ModbusModel.updateDevice(modbusId, data);

  //     /*
  //      *กำหนดค่าที่เปลี่ยนแปลง
  //      */
  //     const { length: oldLength, start: oldStart } = oldDevice;
  //     const { length: newLength, start: newStart } = data;
  //     console.log("🚀 ~ updateDevice ~ oldLength:", oldLength, " newLength:", newLength);
  //     console.log("🚀 ~ updateDevice ~ oldStart:", oldStart, "newStart:", newStart);

  //     let addResult = null;
  //     let updateResult = null;
  //     let deleteResult = null;

  //     // จัดการกรณี Length เปลี่ยนแปลง
  //     if (oldLength !== newLength) {
  //       console.log("🚀 ~ updateDevice ~ (oldLength !== newLength):", oldLength !== newLength);
  //       if (oldLength > newLength) {
  //         console.log("🚀 ~ updateDevice ~ (oldLength > newLength):", oldLength > newLength);
  //         // ลบ Modbus Messages ที่เกินออก
  //         const countToDelete = oldLength - newLength;
  //         console.log(`Deleting ${countToDelete} messages.`);
  //         deleteResult = await ModbusModel.deleteLastMessages(modbusId, countToDelete);
  //       } else if (oldLength < newLength) {
  //         console.log("🚀 ~ updateDevice ~  (oldLength < newLength):", oldLength < newLength);
  //         // เพิ่ม Modbus Messages
  //         const countToAdd = newLength - oldLength;
  //         console.log(`Adding ${countToAdd} messages.`);
  //         addResult = await this.addMessages(modbusId, oldLength, oldStart, countToAdd, data.modified_by);
  //       }
  //     }

  //     // จัดการกรณี Start เปลี่ยนแปลง
  //     if (oldStart !== newStart) {
  //       console.log("🚀 ~ updateDevice ~ (oldStart !== newStart):", oldStart !== newStart);
  //       const updateMessages = await ModbusModel.updateMessagesStart(modbusId, newStart);
  //       updateResult = updateMessages;
  //     }

  //     return { updatedDevice, messages: { addResult, updateResult, deleteResult } };
  //   },
  //   async addMessages(modbusId, oldLength, start, countToAdd, createdBy) {
  //     const messages = [];
  //     for (let i = 1; i <= countToAdd; i++) {
  //       const length_count = start + oldLength + i - 1; // คำนวณค่า length_count ใหม่
  //       const name = `Address-${length_count}`;
  //       messages.push({
  //         modbus_id: modbusId,
  //         length_count,
  //         name,
  //         message: "off",
  //         created_by: createdBy
  //       });
  //     }
  //     const createMessages = await ModbusModel.createMessagesBatch(messages); // เพิ่มข้อมูลแบบ batch

  //     return createMessages;
  //   },

  async updateMessage(messageId, data) {
    const existingMessage = await ModbusModel.getMessageById(messageId);
    // ตรวจสอบการเปลี่ยนแปลงของ length_count
    if (existingMessage.length_count !== data.length_count) {
      data.modified_date = new Date();
    }
    return await ModbusModel.updateMessage(messageId, data);
  },

  async findDevices(ip, port) {
    try {
      const devices = await ModbusModel.findDevicesByIpPort(ip, port);

      if (devices.length === 0) {
        return {
          success: false,
          status: 404,
          message: "No devices found with the specified IP and Port",
          data: []
        };
      }

      return {
        success: true,
        status: 200,
        message: "Devices found successfully",
        data: devices
      };
    } catch (error) {
      throw new Error(`Error finding devices: ${error.message}`);
    }
  },

  async addMessages(modbusId, currentLength, start, countToAdd, createdBy) {
    // ตรวจสอบค่า length_count ปัจจุบัน
    const existingMessages = await ModbusModel.showMessagesByModbusId(modbusId);

    // Validate that existingMessages is an array
    if (!Array.isArray(existingMessages)) {
      throw new Error("Invalid data: existingMessages is not an array");
    }

    const existingLengthCounts = existingMessages.map((msg) => msg.length_count);

    console.log("🚀 existingMessages type:", typeof existingMessages, Array.isArray(existingMessages));
    console.log("🚀 existingMessages data:", existingMessages);

    const messages = [];
    for (let i = 0; i < countToAdd; i++) {
      let length_count = start + currentLength + i;

      // หาก length_count ซ้ำ ให้ปรับค่าใหม่
      while (existingLengthCounts.includes(length_count)) {
        length_count += 1;
      }

      const name = `Address-${length_count}`;
      messages.push({
        modbus_id: modbusId,
        length_count,
        name,
        message: "off",
        created_by: createdBy
      });

      // บันทึก length_count ที่เพิ่มใหม่ใน array เพื่อตรวจสอบ
      existingLengthCounts.push(length_count);
    }

    console.log("🚀 Messages to be added:", messages);
    const createMessages = await ModbusModel.createMessagesBatch(messages);

    if (createMessages.length !== countToAdd) {
      throw new Error(`Error adding messages: Expected ${countToAdd} messages, but added ${createMessages.length}`);
    }

    console.log("🚀 Messages added successfully:", createMessages.name);
    return createMessages;
  },

  async updateDevice(modbusId, data) {
    const currentCount = await ModbusModel.countMessagesByModbusId(modbusId);
    console.log("🚀 ~ updateDevice ~ currentCount:", currentCount);

    const oldDevice = await ModbusModel.getDeviceById(modbusId);
    if (!oldDevice) throw new Error("Modbus device not found");

    const updatedDevice = await ModbusModel.updateDevice(modbusId, data);

    const { length: oldLength, start: oldStart } = oldDevice;
    const { length: newLength, start: newStart } = data;

    let addResult = null;
    let updateResult = null;
    let deleteResult = null;

    if (currentCount !== newLength) {
      if (currentCount > newLength) {
        const countToDelete = currentCount - newLength;
        console.log(`🚀 Deleting ${countToDelete} messages.`);
        deleteResult = await ModbusModel.deleteLastMessages(modbusId, countToDelete);
      } else if (currentCount < newLength) {
        const countToAdd = newLength - currentCount;
        console.log(`🚀 Adding ${countToAdd} messages.`);
        addResult = await this.addMessages(modbusId, currentCount, oldStart, countToAdd, data.modified_by);
      }
    }

    if (oldStart !== newStart) {
      console.log(`🚀 Updating Start from ${oldStart} to ${newStart}`);
      updateResult = await ModbusModel.updateMessagesStart(modbusId, newStart);
    }

    // ตรวจสอบความถูกต้อง
    await this.validateMessageConsistency(modbusId);

    console.log("🚀 Final validation passed: All messages are consistent.");

    return { updatedDevice, messages: { addResult, updateResult, deleteResult } };
  },

  async validateMessageConsistency(modbusId) {
    const messages = await ModbusModel.showMessagesByModbusId(modbusId);

    // ตรวจสอบว่า `messages` เป็น array
    if (!Array.isArray(messages)) {
      throw new Error("Validation failed: messages is not an array");
    }

    const lengthCounts = messages.map((msg) => msg.length_count);

    // ตรวจหา Address ที่ซ้ำ
    const duplicates = lengthCounts.filter((count, index) => lengthCounts.indexOf(count) !== index);

    if (duplicates.length > 0) {
      throw new Error(`Validation failed: Duplicate length_count found - ${duplicates}`);
    }

    console.log("🚀 Validation passed: No duplicate length_count found.");
  }
};
