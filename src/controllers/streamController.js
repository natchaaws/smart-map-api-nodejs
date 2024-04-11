const StreamModel = require("../models/StreamModel");

class StreamController {
  constructor() {
    this.rtspStreamModel = null;
  }

  startStream(req, res) {
    try {
      const { streamName, streamUrl, wsPort } = req.body;
      
      console.log({ streamName, streamUrl, wsPort });
      
      if (!streamName || !streamUrl || !wsPort) {
        return res.status(400).json({ error: "Invalid parameters" });
      }

      this.rtspStreamModel = new StreamModel(streamName, streamUrl, wsPort);
      this.rtspStreamModel.startStream();

      res.status(200).json({
        success: true,
        status: 200,
        message: "Streaming started successfully.",
        stream: { startStream: "started",name: streamName, streamUrl, wsPort },
      });
      console.log({
        success: true,
        status: 200,
        message: "Streaming started successfully.",
        stream: { startStream: "started",name: streamName, streamUrl, wsPort },
      });
    } catch (error) {
      console.error({
        success: false,
        status: 500,
        error: `Error starting stream:`,
        error,
      });
      res
        .status(500)
        .json({ success: false, status: 500, error: "Internal Server Error" });
    }
  }

  stopStream(req, res) {
    try {
      const { streamName, streamUrl, wsPort } = req.body;

      if (!this.rtspStreamModel) {
        return res.status(400).json({
          success: false,
          status: 400,
          error: "No streams are currently active.",
        });
      }

      // Check if the stream to stop matches the provided parameters
      if (
        this.rtspStreamModel.streamName === streamName &&
        this.rtspStreamModel.streamUrl === streamUrl &&
        this.rtspStreamModel.wsPort === wsPort
      ) {
        this.rtspStreamModel.stopStream();
        this.rtspStreamModel = null;
        res.status(200).json({
          success: true,
          status: 200,
          message: "Streaming stopped successfully.",
          stream: { name: streamName, streamUrl, wsPort },
        });
        console.log({
          success: true,
          status: 200,
          message: "Streaming stopped successfully.",
          stream: {
            startStream: "stopped",
            name: streamName,
            streamUrl,
            wsPort,
          },
        });
      } else {
        res.status(404).json({ error: "Stream not found." });
      }
    } catch (error) {
      console.error("Error stopping stream:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // stopStream(req, res) {
  //   try {
  //     if (this.rtspStreamModel) {
  //       this.rtspStreamModel.stopStream();
  //       this.rtspStreamModel = null;
  //     }

  //     res.status(200).json({ message: "Streaming stopped successfully." });
  //   } catch (error) {
  //     console.error("Error stopping stream:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }

  getStatus(req, res) {
    try {
      const status = this.rtspStreamModel ? "Streaming" : "Not Streaming";
      res.status(200).json({ status });
    } catch (error) {
      console.error("Error getting stream status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  getAllStatus(req, res) {
    try {
      const allStreamsStatus = [];

      // ตรวจสอบว่ามี stream ถูกสร้างขึ้นหรือไม่
      if (this.rtspStreamModel) {
        // เรียกใช้เมธอด getStatus ของทุกรายการ
        for (const streamModel of this.rtspStreamModel) {
          const status = streamModel.getStatus();
          allStreamsStatus.push({ streamName: streamModel.streamName, status });
        }
      }

      res.status(200).json({ allStreamsStatus });
    } catch (error) {
      console.error("Error getting all stream status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = StreamController;
