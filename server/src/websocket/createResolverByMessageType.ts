import WebSocketWrapper from './WebSocketWrapper';
import { BaseIncomingMessage, BaseOutgoingMessage } from './types';
import { createOutgoingValidationErrorMessage } from './outgoing-message-creators/createOutgoingValidationErrorMessage';
import processMiddleware from './middleware/processMiddleware';
import { wss } from './init';
import { createOutgoingMessageCreator } from './createOutgoingMessageCreator';
import { ApplicationError, useCaseManager } from '@/application';

type Options<
  TIncomingPayload extends BaseIncomingMessage['payload'],
  TOutgoingPayload extends BaseOutgoingMessage['payload'],
  TContext extends Record<string, any>,
> = {
  middleware: any[];
  execute: (options: {
    ctx: BaseContext & TContext;
    client: WebSocketWrapper;
    payload: TIncomingPayload;
  }) => TOutgoingPayload | Promise<TOutgoingPayload>;
  validator?: (options: { payload: TIncomingPayload }) => boolean;
  init?: () => void;
};

type BaseContext = {
  useCaseManager: typeof useCaseManager;
};

const createResolverByMessageType = <
  TIncomingPayload extends BaseIncomingMessage['payload'],
  TOutgoingPayload extends BaseOutgoingMessage['payload'],
  TContext extends Record<string, any> = Record<string, any>,
>(
  messageType: string,
  options: Options<TIncomingPayload, TOutgoingPayload, TContext>
) => {
  options.init?.();

  wss.on('connection', (ws, request) => {
    const client = new WebSocketWrapper(ws);

    client.onMessage(async (message) => {
      const messageTypeMatch = message.type === messageType;

      if (!messageTypeMatch) {
        return;
      }

      const isInvalid = options.validator && !options.validator({ payload: message.payload as TIncomingPayload });

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

      // const createResponseOutgoingMessage = createOutgoingMessageCreator<TResponseOutgoingMessage>({
      //   type: options.responseOutgoingMessageType,
      // });

      try {
        const payload = await options.execute({
          ctx,
          payload: message.payload as TIncomingPayload,
          client,
        });

        client.respondTo(message, {
          type: messageType + '_RESULT',
          payload,
        });
      } catch (e) {
        if (e instanceof ApplicationError) {
          // const createResponseOutgoingMessage = createOutgoingMessageCreator<TResponseOutgoingMessage>({
          //   type: 'ERROR',
          // });

          client.respondTo(message, {
            type: 'ERROR',
            payload: {
              errorType: e.type,
              message: e.message,
              details: e.details,
            },
          });

          // createResponseOutgoingMessage({
          //   payload: {
          //     errorType: e.type,
          //     message: e.message,
          //     details: e.details,
          //   },
          // })
        } else {
          client.respondTo(message, {
            type: 'ERROR',
            payload: {
              errorType: 'unknown',
              message: 'Unknown error',
            },
          });
        }
      }
    });
  });

  return options;
};

export default createResolverByMessageType;
