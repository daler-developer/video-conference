import createResolverByMessageType from '../../createResolverByMessageType';
import subscriptionManager from '../../SubscriptionManager';
import { BaseIncomingMessage, BaseOutgoingMessage } from '../../types';

const EVENT_UNSUB = 'EVENT_UNSUB';

type IncomingPayload = {
  eventName: string;
  eventParams: Record<string, unknown>;
};

type OutgoingPayload = {
  message: string;
};

export default createResolverByMessageType<IncomingPayload, OutgoingPayload>(EVENT_UNSUB, {
  middleware: [],
  async execute({ client, payload }) {
    subscriptionManager.unsubscribe(payload.eventName as any, {
      client,
      params: payload.eventParams,
    });

    return {
      message: 'Success',
    };
  },
});
