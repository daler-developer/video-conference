import {
  type BaseOutgoingMessage,
  type BaseIncomingMessage,
  type BaseIncomingMessagePayload,
  type BaseOutgoingMessagePayload,
  type OutgoingMessageExtractType,
  type OutgoingMessageExtractPayload,
  type IncomingMessageExtractType,
  type IncomingMessageExtractPayload,
} from "./types";
import {
  createOutgoingMessageCreator,
  type OutgoingMessageCreator,
} from "./createOutgoingMessageCreator.ts";
import websocketClient from "./WebsocketClient.ts";
import { incomingMessageIsOfTypeError } from "./utils.ts";

export {
  createOutgoingMessageCreator,
  websocketClient,
  type OutgoingMessageCreator,
  type BaseOutgoingMessage,
  type BaseIncomingMessage,
  type BaseIncomingMessagePayload,
  type BaseOutgoingMessagePayload,
  type OutgoingMessageExtractType,
  type OutgoingMessageExtractPayload,
  type IncomingMessageExtractType,
  type IncomingMessageExtractPayload,
  incomingMessageIsOfTypeError,
};
