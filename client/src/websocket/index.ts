import { type BaseOutgoingMessage, type BaseIncomingMessage } from "./types";
import { createOutgoingMessageCreator } from "./createOutgoingMessageCreator.ts";
import websocketClient from "./WebsocketClient.ts";
import { incomingMessageIsOfTypeError } from "./utils.ts";

export {
  createOutgoingMessageCreator,
  websocketClient,
  type BaseOutgoingMessage,
  type BaseIncomingMessage,
  incomingMessageIsOfTypeError,
};
