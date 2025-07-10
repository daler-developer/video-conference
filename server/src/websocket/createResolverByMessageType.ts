import WebSocketWrapper from './WebSocketWrapper';
import { BaseIncomingMessage, BaseOutgoingMessage } from './types';
import { createOutgoingValidationErrorMessage } from './outgoing-message-creators/createOutgoingValidationErrorMessage';
import processMiddleware from './middleware/processMiddleware';
import { wss } from './init';
import { createOutgoingMessageCreator } from './createOutgoingMessageCreator';

type Options<TIncomingMessage extends BaseIncomingMessage> = {
  middleware: any[];
  execute: (options: {
    ctx: any;
    message: TIncomingMessage;
    client: WebSocketWrapper;
  }) => any;
  validator?: (options: { message: TIncomingMessage }) => boolean;
  init?: () => void;
};

const createResolverByMessageType = <
  TIncomingMessage extends BaseIncomingMessage,
>(
  messageType: TIncomingMessage['type'],
  options: Options<TIncomingMessage>
) => {
  options.init?.();

  wss.on('connection', (ws, request) => {
    const client = new WebSocketWrapper(ws);

    client.onMessage(async (message) => {
      const messageTypeMatch = message.type === messageType;

      if (!messageTypeMatch) {
        return;
      }

      const ctx: any = {};

      const isInvalid =
        options.validator &&
        !options.validator({ message: message as TIncomingMessage });

      if (isInvalid) {
        client.respondTo(
          message,
          createOutgoingValidationErrorMessage({
            message: 'Validation Errors',
            details: {},
          })
        );
        return;
      }

      processMiddleware(options.middleware, { ctx, message, request });

      options.execute({
        ctx,
        message: message as TIncomingMessage,
        client,
      });
    });
  });

  return options;
};

export default createResolverByMessageType;
