const NodeRtspStream = require("node-rtsp-stream");

class StreamModel {
  constructor(streamName, streamUrl, wsPort) {
    this.streamName = streamName;
    this.streamUrl = streamUrl;
    this.wsPort = wsPort;
    this.stream = null;
  }

  startStream() {
    this.stream = new NodeRtspStream({
      name: this.streamName,
      streamUrl: this.streamUrl,
      wsPort: this.wsPort,
      ffmpegOptions: {
        "-stats": "",
        "-r": 30,
      },
    });
  }

  stopStream() {
    if (this.stream) {
      this.stream.stop();
      this.stream = null;
    }
  }

  getStatus() {
    return this.stream ? "Streaming" : "Not Streaming";
  }
}

module.exports = StreamModel;
