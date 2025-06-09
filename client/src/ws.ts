const ws = new WebSocket("ws://localhost:3000?token=DalerSaidov");

ws.binaryType = "blob";

export default ws;
