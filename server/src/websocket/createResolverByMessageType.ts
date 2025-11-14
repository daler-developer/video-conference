import WebSocketWrapper from './WebSocketWrapper';
import { BaseIncomingMessage, BaseOutgoingMessage } from './types';
import { createOutgoingValidationErrorMessage } from './outgoing-message-creators/createOutgoingValidationErrorMessage';
import processMiddleware from './middleware/processMiddleware';
import { wss } from './init';
import { createOutgoingMessageCreator } from './createOutgoingMessageCreator';
import { ApplicationError, useCaseManager, UseCaseRunner } from '@/application';
import { populateUser } from '@/websocket/middleware/populateUser';

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

export type BaseContext = {
  userId?: number;
  useCaseRunner: UseCaseRunner;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createOutgoingErrorMessage = createOutgoingMessageCreator<{
  message: string;
  errorType: string;
  details?: object;
}>('ERROR');

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
      await sleep(0);

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

      const ctx: BaseContext & TContext = {} as BaseContext & TContext;

      const defaultMiddleware = [populateUser];

      processMiddleware([...defaultMiddleware, ...options.middleware], { ctx, message, request });

      ctx.useCaseRunner = new UseCaseRunner({ currentUserId: ctx.userId });

      try {
        const payload = await options.execute({
          ctx,
          payload: message.payload as TIncomingPayload,
          client,
        });

        const createResponseOutgoingMessage = createOutgoingMessageCreator<any>(messageType + '_RESULT');

        client.respondTo(message, createResponseOutgoingMessage(payload));
      } catch (e) {
        if (e instanceof ApplicationError) {
          client.respondTo(
            message,
            createOutgoingErrorMessage({
              errorType: e.type,
              message: e.message,
              details: e.details,
            })
          );
        } else {
          console.log(e);
          client.respondTo(
            message,
            createOutgoingErrorMessage({
              errorType: 'unknown',
              message: 'Unknown error',
              details: {
                foo: 'bar',
              },
            })
          );
        }
      }
    });
  });

  return options;
};

export default createResolverByMessageType;
