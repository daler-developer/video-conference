import {
  type BaseOutgoingMessage,
  type BaseIncomingMessage,
  type BaseIncomingMessagePayload,
} from "./types";
import { createOutgoingMessageCreator } from "./createOutgoingMessageCreator.ts";
import websocketClient from "./WebsocketClient.ts";
import { incomingMessageIsOfTypeError } from "./utils.ts";

export {
  createOutgoingMessageCreator,
  websocketClient,
  type BaseOutgoingMessage,
  type BaseIncomingMessage,
  type BaseIncomingMessagePayload,
  incomingMessageIsOfTypeError,
};
