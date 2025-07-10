import createResolverByMessageType from '../../createResolverByMessageType';
import subscriptionManager from '../../SubscriptionManager';
import { BaseIncomingMessage, BaseOutgoingMessage } from '../../types';

const MESSAGE_TYPE = 'EVENT_UNSUB';
const OUTGOING_MESSAGE_TYPE = 'EVENT_UNSUB_RESULT';

type IncomingMessage = BaseIncomingMessage<
  typeof MESSAGE_TYPE,
  {
    eventName: string;
    eventParams: Record<string, unknown>;
  }
>;

type OutgoingMessage = BaseOutgoingMessage<
  typeof OUTGOING_MESSAGE_TYPE,
  {
    message: string;
  }
>;

export default createResolverByMessageType<IncomingMessage>(MESSAGE_TYPE, {
  middleware: [],
  async execute({ client, message }) {
    subscriptionManager.unsubscribe(message.payload.eventName as any, {
      client,
      params: message.payload.eventParams,
    });

    return {
      message: 'Success',
    };
  },
});
