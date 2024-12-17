// src/controllers/modbusController.js

const ModbusService = require("../services/modbusService");

module.exports = {
  // ดึงข้อมูล modbus_devices แบบแบ่งหน้า
  async getDevices(req, res) {
    const page = parseInt(req.body.page) || 1;
    const perPage = parseInt(req.body.perPage) || 10;
    const searchWord = req.body.searchWord || "";

    try {
      const result = await ModbusService.getDevices(page, perPage, searchWord);

      if (result.data.length === 0) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "No devices found"
        });
      }
      res.status(200).json({
        success: true,
        status: 200,
        message: "Devices retrieved successfully",
        result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        status: 500,
        message: "Internal Server Error",
        error: error.message
      });
    }
  },
  // ดึงข้อมูล modbus_messages แบบแบ่งหน้า
  async getMessages(req, res) {
    const { modbusId } = req.params;
    const page = parseInt(req.body.page) || 1;
    const perPage = parseInt(req.body.perPage) || 10;
    const searchWord = req.body.searchWord || "";
    // ตรวจสอบว่า modbusId ถูกส่งมาหรือไม่
    if (!modbusId) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Bad Request: modbusId is required"
      });
    }

    try {
      const result = await ModbusService.getMessages(modbusId, page, perPage, searchWord);
      // ตรวจสอบว่ามีข้อมูลหรือไม่
    //   if (result.data.length === 0) {
    //     return res.status(404).json({
    //       success: false,
    //       status: 404,
    //       message: "No messages found for the specified modbusId"
    //     });
    //   }
      // ส่งข้อมูลกลับพร้อมปรับรูปแบบ length_count
      res.status(200).json({
        success: true,
        status: 200,
        message: "Messages retrieved successfully",
        result: {
          ...result,
          data: result.data.map((item) => ({
            ...item,
            length_count: item.length_count.toString().padStart(6, "0") // แปลง length_count
          }))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        status: 500,
        message: "Internal Server Error",
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
        message: "Internal Server Error",
        error: error.message
      });
    }
  },

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
        message: "Internal Server Error",
        error: error.message
      });
    }
  },

  async updateStatus(req, res) {
    const { modbusId } = req.params;
    const { status } = req.body;
    const modifiedBy = req.userData.username;
    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    if (!modbusId) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Bad Request: modbusId is required"
      });
    }
    if (status === undefined || status === null) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Bad Request: status is required"
      });
    }

    try {
      const updatedDevice = await ModbusService.updateStatus(modbusId, status, modifiedBy);
      // ถ้าอัปเดตสำเร็จ
      res.status(200).json({
        success: true,
        status: 200,
        message: "Modbus device status updated successfully",
        data: updatedDevice
      });
    } catch (error) {
      // ตรวจสอบว่าเป็นข้อผิดพลาดของ Client หรือ Server
      const statusCode = error.message.includes("not found") || error.message.includes("already deleted") ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: error.message.includes("not found")
          ? "Modbus device not found"
          : "Failed to update modbus device status",
        error: error.message
      });
    }
  },

  async findDevices(req, res) {
    const { ip, port } = req.body;

    if (!ip || !port) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "IP and Port are required"
      });
    }

    try {
      const result = await ModbusService.findDevices(ip, port);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        status: 500,
        message: "Internal Server Error",
        error: error.message
      });
    }
  },

  // อัปเดตข้อมูลใน modbus_devices
//   async updateDevice(req, res) {
//     const { modbusId } = req.params;
//     const modifiedBy = req.userData.username;

//     try {
//           // รวบรวมข้อมูลจาก body และเพิ่มข้อมูล `modified_by`
//       const data = { ...req.body, modified_by: modifiedBy };
//     // เรียกใช้ Service เพื่อตรวจสอบและอัปเดต
//       const updatedDevice = await ModbusService.updateDevice(modbusId, data);

//       res.status(200).json({
//         success: true,
//         status: 200,
//         message: "Modbus device updated successfully",
//         data: updatedDevice
//       });
//     } catch (error) {
//        // ตรวจสอบข้อผิดพลาดที่อาจเกิดขึ้น
//         const statusCode = error.message.includes("not found") ? 404 : 500;

//         res.status(statusCode).json({
//             success: false,
//             status: statusCode,
//             message: "Failed to update modbus device",
//             error: error.message
//         });
//     }
//   },

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
        message: "Modbus message updated successfully",
        data: updatedMessage
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        status: 400,
        message: "Failed to update message",
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
        message: "Modbus device deleted successfully",
        data: deletedDevice
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        status: 400,
        message: "Failed to delete device",
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
        message: "Modbus message deleted successfully",
        data: deletedMessage
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        status: 400,
        message: "Failed to delete modbus message",
        error: error.message
      });
    }
  },

  // -----------------edit 2 Messages-----------------

// อัปเดตข้อมูลใน modbus_devices
async updateDevice(req, res) {
    const { modbusId } = req.params; // ดึง modbusId จาก params
    const modifiedBy = req.userData.username; // ดึง username ของผู้ใช้ที่แก้ไขจาก token

    try {
        // รวบรวมข้อมูลจาก body และเพิ่ม `modified_by`
        const data = { ...req.body, modified_by: modifiedBy };

        // เรียกใช้ Service เพื่อตรวจสอบและอัปเดต
        const updatedDevice = await ModbusService.updateDevice(modbusId, data);

        // ตอบกลับสำเร็จ
        res.status(200).json({
            success: true,
            status: 200,
            message: "Modbus device updated successfully",
            data: updatedDevice,
        });
    } catch (error) {
        // ตรวจสอบข้อผิดพลาดที่อาจเกิดขึ้น
        const statusCode = error.message.includes("not found") ? 404 : 500;

        res.status(statusCode).json({
            success: false,
            status: statusCode,
            message: error.message.includes("not found")
                ? "Modbus device not found"
                : "Failed to update modbus device",
            error: error.message,
        });
    }
},


};
