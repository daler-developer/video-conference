const ws = new WebSocket("ws://localhost:3000?token=DalerSaidov");

ws.binaryType = "arraybuffer";

export default ws;
