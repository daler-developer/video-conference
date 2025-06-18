import WebSocket from 'ws';

const isPlainObject = (obj: unknown) => {
  return (
    Object.prototype.toString.call(obj) === '[object Object]' &&
    (Object.getPrototypeOf(obj) === Object.prototype ||
      Object.getPrototypeOf(obj) === null)
  );
};

class WebSocketWrapper {
  constructor(private ws: WebSocket) {}

  async send(message: { [key: string]: unknown }, binary?: Buffer) {
    const stringBuf = Buffer.from(JSON.stringify(message), 'utf8');
    const stringLenBuf = Buffer.alloc(4);
    stringLenBuf.writeUInt32BE(stringBuf.length, 0);

    const res = [stringLenBuf, stringBuf];

    if (binary) {
      res.push(binary);
    }

    const finalBuffer = Buffer.concat(res);

    this.ws.send(finalBuffer, { binary: true });
  }
}

export default WebSocketWrapper;
