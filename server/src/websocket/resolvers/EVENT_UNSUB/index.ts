import createResolverByMessageType from '../../createResolverByMessageType';
import subscriptionManager from '../../SubscriptionManager';

type Payload = {
  eventName: string;
  eventParams: Record<string, unknown>;
};

export default createResolverByMessageType<Payload>({
  type: 'EVENT_UNSUB',
  middleware: [],
  execute({ client, message }) {
    subscriptionManager.unsubscribe(message.payload.eventName as any, {
      client,
      params: message.payload.eventParams,
    });
  },
});
