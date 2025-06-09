import WebSocket from 'ws';

class WebSocketWrapper {
  constructor(private ws: WebSocket) {}

  send(message: unknown) {}
}

export default WebSocketWrapper;
