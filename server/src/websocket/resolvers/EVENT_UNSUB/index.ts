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

type ResponseOutgoingMessage = BaseOutgoingMessage<
  typeof OUTGOING_MESSAGE_TYPE,
  {
    message: string;
  }
>;

export default createResolverByMessageType<IncomingMessage, ResponseOutgoingMessage>(MESSAGE_TYPE, {
  responseOutgoingMessageType: OUTGOING_MESSAGE_TYPE,
  middleware: [],
  async execute({ client, message, respond }) {
    subscriptionManager.unsubscribe(message.payload.eventName as any, {
      client,
      params: message.payload.eventParams,
    });

    respond({
      payload: {
        message: 'Success',
      },
    });
  },
});
