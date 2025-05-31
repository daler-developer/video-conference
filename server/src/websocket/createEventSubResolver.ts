import pubsub, { CHANNEL_NAME, CHANNEL_PAYLOAD_MAP } from './pubsub';
import { EVENT_NAME } from './types';
import subscriptionManager from './SubscriptionManager';

type Options<TChannelName extends CHANNEL_NAME> = {
  eventName: EVENT_NAME;
  channelName: TChannelName;
  middleware?: any[];
  format: (payload: CHANNEL_PAYLOAD_MAP[TChannelName], params: any) => void;
  activate: (
    payload: CHANNEL_PAYLOAD_MAP[TChannelName],
    params: any
  ) => boolean;
};

const createEventSubResolver = <TChannelName extends CHANNEL_NAME>(
  options: Options<TChannelName>
) => {
  pubsub.subscribe(options.channelName, (payload) => {
    const subscribers = subscriptionManager.getSubscribers(options.eventName);
    subscribers.forEach((subscriber) => {
      const activate = options.activate(payload, subscriber.params);
      if (activate) {
        const msg = options.format(payload, subscriber.params);
        subscriber.ws.send(JSON.stringify(msg));
      }
    });
  });

  return options;
};

export default createEventSubResolver;
