import ws from "./ws.ts";

const isPlainObject = (obj: unknown): obj is any => {
  if (typeof obj !== "object" || obj === null) return false;
  const proto = Object.getPrototypeOf(obj);
  return proto === Object.prototype || proto === null;
};

const isBlob = (obj: unknown): obj is Blob => {
  return obj instanceof Blob;
};

const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

const isSlotForBinary = (str: string): str is string => {
  return str.startsWith("$$") && str.endsWith("$$");
};

const parseSlotForBinary = (str: string) => {
  return str.slice(2, -2).split(":").map(Number);
};

class WebsocketClient {
  callbacks: Array<(event: MessageEvent) => void> = [];

  constructor() {
    ws.onmessage = (event) => {
      for (const callback of this.callbacks) {
        callback(event);
      }
    };
  }

  private async parseMessage(event: MessageEvent) {
    const buf = new Uint8Array(event.data);
    const dataView = new DataView(buf.buffer);
    const strLen = dataView.getUint32(0);
    const textDecoder = new TextDecoder("utf-8");
    const message = JSON.parse(textDecoder.decode(buf.slice(4, 4 + strLen)));
    const parsedBinary = buf.slice(4 + strLen);

    const helper = async (message: { [key: string]: unknown }) => {
      for (const [key, value] of Object.entries(message)) {
        if (isString(value) && isSlotForBinary(value)) {
          const [start, end] = parseSlotForBinary(value);
          message[key] = parsedBinary.subarray(start, end + 1).buffer;
        }
        if (isPlainObject(value)) {
          await helper(value);
        }
      }
    };

    await helper(message);

    return message;
  }

  public async onMessage(cb: (message: { [key: string]: unknown }) => void) {
    this.callbacks.push(async (event) => {
      const parsed = await this.parseMessage(event);

      cb(parsed);
    });
  }

  public async sendMessage(message: { [key: string]: unknown }) {
    const arrayBuffers: Array<Uint8Array> = [];
    let total = 0;

    const helper = async (message: { [key: string]: unknown }) => {
      for (const [key, value] of Object.entries(message)) {
        if (isBlob(value)) {
          const blobBuffer = new Uint8Array(await value.arrayBuffer());
          arrayBuffers.push(blobBuffer);
          const start = total;
          const end = start + blobBuffer.length - 1;
          total += blobBuffer.length;
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

    ws.send(full);
  }
}

export default new WebsocketClient();
