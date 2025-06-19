import ws from "./ws.ts";

const isPlainObject = (obj: unknown): obj is any => {
  if (typeof obj !== "object" || obj === null) return false;
  const proto = Object.getPrototypeOf(obj);
  return proto === Object.prototype || proto === null;
};

const isBlob = (obj: unknown): obj is Blob => {
  return obj instanceof Blob;
};

class WebsocketClient {
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

    console.log(total);

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

    // ws.send(full);
  }
}

export default new WebsocketClient();
