import WebSocket from 'ws';

const isPlainObject = (obj: unknown): obj is any => {
  if (typeof obj !== 'object' || obj === null) return false;
  const proto = Object.getPrototypeOf(obj);
  return proto === Object.prototype || proto === null;
};

const isBlob = (obj: unknown): obj is Blob => {
  return obj instanceof Blob;
};

const isBuffer = (value: unknown): value is Buffer => {
  return Buffer.isBuffer(value);
};

const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

const isSlotForBinary = (str: string): str is string => {
  return str.startsWith('$$') && str.endsWith('$$');
};

const parseSlotForBinary = (str: string) => {
  return str.slice(2, -2).split(':').map(Number);
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

  private async parseMessage(raw: Buffer) {
    const view = new DataView(raw.buffer);
    const metaLength = view.getUint32(0);
    const jsonBuffer = Buffer.from(raw.buffer.slice(4, 4 + metaLength));
    const parsedMessage = JSON.parse(jsonBuffer.toString());
    const parsedBinary = Buffer.from(raw.buffer.slice(4 + metaLength));

    const helper = async (message: { [key: string]: unknown }) => {
      for (const [key, value] of Object.entries(message)) {
        if (isString(value) && isSlotForBinary(value)) {
          const [start, end] = parseSlotForBinary(value);
          message[key] = Buffer.from(parsedBinary.subarray(start, end + 1));
        }
        if (isPlainObject(value)) {
          await helper(value);
        }
      }
    };

    await helper(parsedMessage);

    return parsedMessage;
  }

  async onMessage(cb: (message: any) => void) {
    this.ws.on('message', async (message: Buffer, isBinary) => {
      if (!isBinary) {
        throw new Error('only binary');
      }

      const parsed = await this.parseMessage(message);

      cb(parsed);
    });
  }

  public async sendMessage(message: { [key: string]: unknown }) {
    const arrayBuffers: Array<Uint8Array> = [];
    let total = 0;

    const helper = async (message: { [key: string]: unknown }) => {
      for (const [key, value] of Object.entries(message)) {
        if (isBuffer(value)) {
          arrayBuffers.push(value);
          const start = total;
          const end = start + value.length - 1;
          total += value.length;
          message[key] = `$$${start}:${end}$$`;
        }
        if (isPlainObject(value)) {
          await helper(value);
        }
      }
    };

    await helper(message);

    const json = JSON.stringify(message);
    const jsonBytes = new TextEncoder().encode(json);

    const metaLen = new Uint8Array(4);
    new DataView(metaLen.buffer).setUint32(0, jsonBytes.length);

    const full = new Uint8Array(4 + jsonBytes.length + total);

    full.set(metaLen, 0);
    full.set(jsonBytes, 4);

    let offset = 4 + jsonBytes.length;

    for (const arrayBuffer of arrayBuffers) {
      full.set(arrayBuffer, offset);
      offset += arrayBuffer.length;
    }

    this.ws.send(full);
  }
}

export default WebSocketWrapper;
