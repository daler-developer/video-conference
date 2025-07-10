import WebSocketWrapper from './WebSocketWrapper';
import { BaseIncomingMessage, BaseOutgoingMessage } from './types';
import { createOutgoingValidationErrorMessage } from './outgoing-message-creators/createOutgoingValidationErrorMessage';
import processMiddleware from './middleware/processMiddleware';
import { wss } from './init';

type Options<
  TIncomingMessage extends BaseIncomingMessage,
  TOutgoingMessage extends BaseOutgoingMessage,
> = {
  incomingMessageType: TIncomingMessage['type'];
  outgoingMessageType: TOutgoingMessage['type'];
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
  TOutgoingMessage extends BaseOutgoingMessage,
>(
  options: Options<TIncomingMessage, TOutgoingMessage>
) => {
  options.init?.();

  wss.on('connection', (ws, request) => {
    const client = new WebSocketWrapper(ws);

    client.onMessage(async (message) => {
      const messageTypeMatch = message.type === options.incomingMessageType;

      if (!messageTypeMatch) {
        return;
      }

      const ctx: any = {};

      const isInvalid =
        options.validator &&
        !options.validator({ message: message as TIncomingMessage });

      if (isInvalid) {
        client.sendMessage(
          createOutgoingValidationErrorMessage({
            meta: {
              messageId: message.meta.messageId,
            },
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
