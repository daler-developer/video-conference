import type { BaseIncomingMessage, BaseOutgoingMessage } from "./types.ts";
import {
  incomingMessageIsOfTypeError,
  isPlainObject,
  isArrayBuffer,
  isString,
  isSlotForBinary,
  parseSlotForBinary,
} from "./utils";
import { WebsocketError } from "./WebsocketError.ts";

type Callback = (event: MessageEvent) => void;

class WebsocketClient {
  private callbacks: Array<Callback> = [];
  private ws: WebSocket | null = null;

  public isWebSocketConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  public async connect(accessToken?: string | null) {
    const url = new URL("ws://localhost:3000");

    if (accessToken) {
      url.searchParams.append("accessToken", accessToken);
    }

    this.ws = new WebSocket(url);

    this.ws.binaryType = "arraybuffer";

    this.ws.onmessage = (event) => {
      for (const callback of this.callbacks) {
        callback(event);
      }
    };

    return new Promise((res) => {
      this.ws!.addEventListener("open", () => {
        res("Connected");
      });
    });
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

  public onMessage(cb: (message: BaseIncomingMessage) => void) {
    if (!this.isWebSocketConnected()) {
      throw new Error("not connected");
    }

    const callback: Callback = async (event) => {
      const parsed = await this.parseMessage(event);

      cb(parsed);
    };

    this.callbacks.push(callback);

    return () => {
      const idx = this.callbacks.indexOf(callback);
      this.callbacks.splice(idx, 1);
    };
  }

  private async serializeMessage(message: { [key: string]: unknown }) {
    const arrayBuffers: Array<Uint8Array> = [];
    let total = 0;

    const helper = async (message: { [key: string]: unknown }) => {
      for (const [key, value] of Object.entries(message)) {
        if (isArrayBuffer(value)) {
          const blobBuffer = new Uint8Array(value);
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

    return full;
  }

  public async sendMessage(outgoingMessage: BaseOutgoingMessage) {
    if (!this.isWebSocketConnected()) {
      throw new Error("not connected");
    }

    const serialized = await this.serializeMessage(outgoingMessage);

    this.ws!.send(serialized);

    return new Promise<BaseIncomingMessage>((res, rej) => {
      const unsubscribe = this.onMessage((message) => {
        if (
          !incomingMessageIsOfTypeError(message) &&
          message.meta.messageId === outgoingMessage.meta.messageId
        ) {
          unsubscribe();
          res(message);
        }

        if (
          incomingMessageIsOfTypeError(message) &&
          message.meta.messageId === outgoingMessage.meta.messageId
        ) {
          unsubscribe();
          rej(new WebsocketError(message));
        }
      });

      // TODO
      // setTimeout(() => {
      //   off();
      //   rej();
      // }, 5000);
    });
  }
}

export default new WebsocketClient();
