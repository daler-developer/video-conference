import pubsub, { CHANNEL_NAME, CHANNEL_PAYLOAD_MAP } from './pubsub';
import { EVENT_NAME } from './types';
import subscriptionManager from './SubscriptionManager';
import { ZodObject } from 'zod';

type Options<TChannelName extends CHANNEL_NAME> = {
  eventParamsSchema?: ZodObject<any, any, any>;
  eventName: EVENT_NAME;
  channelName: TChannelName;
  middleware?: any[];
  format: (payload: CHANNEL_PAYLOAD_MAP[TChannelName], params: any) => any;
  activate: (
    payload: CHANNEL_PAYLOAD_MAP[TChannelName],
    params: any
  ) => boolean;
};

const createEventSubResolver = <TChannelName extends CHANNEL_NAME>(
  options: Options<TChannelName>
) => {
  return options;
};

export default createEventSubResolver;
