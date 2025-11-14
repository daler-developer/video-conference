import pubsub, { CHANNEL_NAME, CHANNEL_PAYLOAD_MAP } from './pubsub';
import { BaseOutgoingMessage } from './types';
import subscriptionManager from './SubscriptionManager';
import { ZodObject } from 'zod';
import { createOutgoingMessageCreator } from './createOutgoingMessageCreator';
import { applicationPubSub, type ApplicationEvents, type ApplicationEventName } from '@/application';
import { BaseContext } from '@/websocket/createResolverByMessageType';

type MaybePromise<T> = T | Promise<T>;

type Options<
  TChannelName extends ApplicationEventName,
  TEventSubDataOutgoingMessage extends BaseEventSubDataOutgoingMessage,
> = {
  eventParamsSchema?: ZodObject<any, any, any>;
  subscribe: {
    channelName: TChannelName;
    filter: (options: { payload: ApplicationEvents[TChannelName]; params: any }) => boolean;
  };
  middleware?: any[];
  format: (options: {
    payload: ApplicationEvents[TChannelName];
    params: any;
    ctx: BaseContext;
  }) => MaybePromise<TEventSubDataOutgoingMessage['payload']['eventData']>;
};

export type BaseEventSubDataOutgoingMessage<
  TEventName extends string = string,
  TEventParams extends Record<string, any> = Record<string, any>,
  TEventData extends Record<string, any> = Record<string, any>,
> = BaseOutgoingMessage<
  'EVENT_SUB_DATA',
  {
    eventName: TEventName;
    eventParams: TEventParams;
    eventData: TEventData;
  }
>;

const createEventSubResolver = <
  TChannelName extends ApplicationEventName,
  TEventSubDataOutgoingMessage extends BaseEventSubDataOutgoingMessage,
>(
  eventName: TEventSubDataOutgoingMessage['payload']['eventName'],
  options: Options<TChannelName, TEventSubDataOutgoingMessage>
) => {
  applicationPubSub.subscribe(options.subscribe.channelName, (payload) => {
    const subscribers = subscriptionManager.getSubscribers(eventName);

    const createEventSubDataOutgoingMessage =
      createOutgoingMessageCreator<TEventSubDataOutgoingMessage['payload']>('EVENT_SUB_DATA');

    subscribers.forEach(async (subscriber) => {
      const activate = options.subscribe.filter({
        payload,
        params: subscriber.params,
      });
      if (activate) {
        const eventData = await options.format({
          payload,
          params: subscriber.params,
          ctx: subscriber.ctx,
        });
        subscriber.client.sendMessage(
          createEventSubDataOutgoingMessage({
            eventName,
            eventParams: subscriber.params,
            eventData,
          })
        );
      }
    });
  });

  return options;
};

export default createEventSubResolver;
