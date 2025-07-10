import WebSocket from 'ws';
import _ from 'lodash';
import { BaseIncomingMessage, BaseOutgoingMessage } from './types';

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

  private async parseMessage(raw: Buffer) {
    const stringLength = raw.readUInt32BE(0);
    const stringBytes = raw.subarray(4, 4 + stringLength);
    const parsedMessage = JSON.parse(stringBytes.toString('utf8'));
    // const parsedBinary = Buffer.from(raw.buffer.slice(4 + stringLength));
    const parsedBinary = raw.subarray(4 + stringLength);

    const helper = async (message: { [key: string]: unknown }) => {
      for (const [key, value] of Object.entries(message)) {
        if (isString(value) && isSlotForBinary(value)) {
          const [start, end] = parseSlotForBinary(value);
          message[key] = parsedBinary.subarray(start, end + 1);
        }
        if (isPlainObject(value)) {
          await helper(value);
        }
      }
    };

    await helper(parsedMessage);

    return parsedMessage;
  }

  async onMessage(cb: (message: BaseIncomingMessage) => void) {
    this.ws.on('message', async (message: Buffer, isBinary) => {
      if (!isBinary) {
        throw new Error('only binary');
      }

      const parsed = await this.parseMessage(message);

      cb(parsed);
    });
  }

  public sendMessage({
    type,
    payload,
  }: Pick<BaseOutgoingMessage, 'payload' | 'type'>) {
    const fullMessage: BaseOutgoingMessage = {
      type,
      payload,
      meta: {},
    };

    return this.baseSendMessage(fullMessage);
  }

  public async respondTo(
    incomingMessage: BaseIncomingMessage,
    { type, payload }: Pick<BaseOutgoingMessage, 'payload' | 'type'>
  ) {
    const fullMessage: BaseOutgoingMessage = {
      type,
      payload,
      meta: {
        messageId: incomingMessage.meta.messageId,
      },
    };

    return this.baseSendMessage(fullMessage);
  }

  private async baseSendMessage(message: BaseOutgoingMessage) {
    message = _.cloneDeep(message);
    const arrayBuffers: Buffer[] = [];
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
