import pubsub, { CHANNEL_NAME, CHANNEL_PAYLOAD_MAP } from './pubsub';
import { EVENT_NAME } from './types';
import subscriptionManager from './SubscriptionManager';
import { ZodObject } from 'zod';

type Options<TChannelName extends CHANNEL_NAME> = {
  eventParamsSchema?: ZodObject<any, any, any>;
  subscribe: {
    channelName: TChannelName;
    filter: (options: {
      payload: CHANNEL_PAYLOAD_MAP[TChannelName];
      params: any;
    }) => boolean;
  };
  eventName: EVENT_NAME;
  middleware?: any[];
  format: (options: {
    payload: CHANNEL_PAYLOAD_MAP[TChannelName];
    params: any;
  }) => any;
};

const createEventSubResolver = <TChannelName extends CHANNEL_NAME>(
  options: Options<TChannelName>
) => {
  return options;
};

export default createEventSubResolver;
