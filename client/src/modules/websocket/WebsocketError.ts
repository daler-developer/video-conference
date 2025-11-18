import { type BaseIncomingErrorMessage } from "./types.ts";

export class WebsocketError extends Error {
  incomingErrorMessage: BaseIncomingErrorMessage;

  constructor(incomingErrorMessage: BaseIncomingErrorMessage) {
    super("Websocket Error");
    this.incomingErrorMessage = incomingErrorMessage;
  }
}
