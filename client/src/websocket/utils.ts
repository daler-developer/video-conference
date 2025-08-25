import { v4 as uuidv4 } from "uuid";
import {
  type BaseIncomingMessage,
  type BaseIncomingErrorMessage,
} from "./types";

export const isPlainObject = (obj: unknown): obj is any => {
  if (typeof obj !== "object" || obj === null) return false;
  const proto = Object.getPrototypeOf(obj);
  return proto === Object.prototype || proto === null;
};

export const isBlob = (obj: unknown): obj is Blob => {
  return obj instanceof Blob;
};

export const isArrayBuffer = (value: unknown): value is ArrayBuffer => {
  return value instanceof ArrayBuffer;
};

export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

export const isSlotForBinary = (str: string): str is string => {
  return str.startsWith("$$") && str.endsWith("$$");
};

export const parseSlotForBinary = (str: string) => {
  return str.slice(2, -2).split(":").map(Number);
};

export const parseMessage = async (event: MessageEvent) => {
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
};

export const serializeMessage = async (message: { [key: string]: unknown }) => {
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
};

export const prepareMeta = () => {
  return {
    messageId: uuidv4(),
  };
};

export const incomingMessageIsOfTypeError = (
  message: BaseIncomingMessage,
): message is BaseIncomingErrorMessage => {
  return message.type === "ERROR";
};
