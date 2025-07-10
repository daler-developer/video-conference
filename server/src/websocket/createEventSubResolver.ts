import pubsub, { CHANNEL_NAME, CHANNEL_PAYLOAD_MAP } from './pubsub';
import { BaseOutgoingMessage } from './types';
import subscriptionManager from './SubscriptionManager';
import { ZodObject } from 'zod';
import { createOutgoingMessageCreator } from './createOutgoingMessageCreator';

type Options<
  TChannelName extends CHANNEL_NAME,
  TEventSubDataOutgoingMessage extends BaseEventSubDataOutgoingMessage,
> = {
  eventParamsSchema?: ZodObject<any, any, any>;
  subscribe: {
    channelName: TChannelName;
    filter: (options: { payload: CHANNEL_PAYLOAD_MAP[TChannelName]; params: any }) => boolean;
  };
  middleware?: any[];
  format: (options: {
    payload: CHANNEL_PAYLOAD_MAP[TChannelName];
    params: any;
  }) => TEventSubDataOutgoingMessage['payload']['eventData'];
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
  TChannelName extends CHANNEL_NAME,
  TEventSubDataOutgoingMessage extends BaseEventSubDataOutgoingMessage,
>(
  eventName: TEventSubDataOutgoingMessage['payload']['eventName'],
  options: Options<TChannelName, TEventSubDataOutgoingMessage>
) => {
  pubsub.subscribe(options.subscribe.channelName, (payload) => {
    const subscribers = subscriptionManager.getSubscribers(eventName);

    const createEventSubDataOutgoingMessage = createOutgoingMessageCreator<TEventSubDataOutgoingMessage>({
      type: 'EVENT_SUB_DATA',
    });

    subscribers.forEach(async (subscriber) => {
      const activate = options.subscribe.filter({
        payload,
        params: subscriber.params,
      });
      if (activate) {
        const eventData = options.format({
          payload,
          params: subscriber.params,
        });
        subscriber.client.sendMessage(
          createEventSubDataOutgoingMessage({
            payload: {
              eventName,
              eventParams: subscriber.params,
              eventData,
            },
          })
        );
      }
    });
  });

  return options;
};

export default createEventSubResolver;
