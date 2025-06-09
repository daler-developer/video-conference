import createResolverByMessageType from '../../createResolverByMessageType';
import subscriptionManager from '../../SubscriptionManager';

type Payload = {
  eventName: string;
  eventParams: Record<string, unknown>;
};

export default createResolverByMessageType<Payload>({
  type: 'EVENT_UNSUB',
  middleware: [],
  execute({ ws, msg }) {
    subscriptionManager.unsubscribe(msg.payload.eventName as any, {
      ws,
      params: msg.payload.eventParams,
    });
  },
});
