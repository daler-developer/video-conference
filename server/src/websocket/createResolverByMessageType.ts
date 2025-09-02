import WebSocketWrapper from './WebSocketWrapper';
import { BaseIncomingMessage, BaseOutgoingMessage } from './types';
import { createOutgoingValidationErrorMessage } from './outgoing-message-creators/createOutgoingValidationErrorMessage';
import processMiddleware from './middleware/processMiddleware';
import { wss } from './init';
import { createOutgoingMessageCreator } from './createOutgoingMessageCreator';
import { ApplicationError, useCaseManager } from '@/application';

type Options<
  TIncomingMessage extends BaseIncomingMessage,
  TResponseOutgoingMessage extends BaseOutgoingMessage,
  TContext extends Record<string, any>,
> = {
  responseOutgoingMessageType: TResponseOutgoingMessage['type'];
  middleware: any[];
  execute: (options: {
    ctx: BaseContext & TContext;
    message: TIncomingMessage;
    client: WebSocketWrapper;
  }) => Promise<TResponseOutgoingMessage['payload']>;
  validator?: (options: { message: TIncomingMessage }) => boolean;
  init?: () => void;
};

type BaseContext = {
  useCaseManager: typeof useCaseManager;
};

const createResolverByMessageType = <
  TIncomingMessage extends BaseIncomingMessage,
  TResponseOutgoingMessage extends BaseOutgoingMessage,
  TContext extends Record<string, any> = Record<string, any>,
>(
  messageType: TIncomingMessage['type'],
  options: Options<TIncomingMessage, TResponseOutgoingMessage, TContext>
) => {
  options.init?.();

  wss.on('connection', (ws, request) => {
    const client = new WebSocketWrapper(ws);

    client.onMessage(async (message) => {
      const messageTypeMatch = message.type === messageType;

      if (!messageTypeMatch) {
        return;
      }

      const isInvalid = options.validator && !options.validator({ message: message as TIncomingMessage });

      if (isInvalid) {
        client.respondTo(
          message,
          createOutgoingValidationErrorMessage({
            message: 'Validation Errors',
            details: {
              foo: 'bar',
              age: 20,
              inner: {
                name: false,
              },
            },
          })
        );
        return;
      }

      const ctx: BaseContext & TContext = {
        useCaseManager,
      } as BaseContext & TContext;

      processMiddleware(options.middleware, { ctx, message, request });

      const createResponseOutgoingMessage = createOutgoingMessageCreator<TResponseOutgoingMessage>({
        type: options.responseOutgoingMessageType,
      });

      try {
        const payload = await options.execute({
          ctx,
          message: message as TIncomingMessage,
          client,
        });

        client.respondTo(
          message,
          createResponseOutgoingMessage({
            payload,
          })
        );
      } catch (e) {
        if (e instanceof ApplicationError) {
          const createResponseOutgoingMessage = createOutgoingMessageCreator<TResponseOutgoingMessage>({
            type: 'ERROR',
          });

          client.respondTo(
            message,
            createResponseOutgoingMessage({
              payload: {
                errorType: e.type,
                message: e.message,
                details: e.details,
              },
            })
          );
        } else {
          console.log('----------------');
        }
      }
    });
  });

  return options;
};

export default createResolverByMessageType;
