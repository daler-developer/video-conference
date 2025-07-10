import type { BaseIncomingMessage } from "./types.ts";

const MESSAGE_TYPE = "ERROR";

export type IncomingErrorMessage = BaseIncomingMessage<
  typeof MESSAGE_TYPE,
  {
    message: string;
  }
>;

export class BaseError extends Error {
  incomingMessage: IncomingErrorMessage;

  constructor(message: IncomingErrorMessage) {
    super(message.payload.message);
    this.incomingMessage = message;
  }
}

export const incomingMessageIsOfTypeError = (
  message: BaseIncomingMessage,
): message is IncomingErrorMessage => {
  return message.type === MESSAGE_TYPE;
};
