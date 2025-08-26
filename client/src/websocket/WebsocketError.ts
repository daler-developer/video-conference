import { type BaseIncomingErrorMessage } from "./types";

export class WebsocketError extends Error {
  incomingErrorMessage: BaseIncomingErrorMessage;

  constructor(incomingErrorMessage: BaseIncomingErrorMessage) {
    super("Websocket Error");
    this.incomingErrorMessage = incomingErrorMessage;
  }
}
