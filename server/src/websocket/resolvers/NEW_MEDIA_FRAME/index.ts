import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import pubsub from '../../pubsub';
import { BaseIncomingMessage, BaseOutgoingMessage } from '../../types';

const MESSAGE_TYPE = 'NEW_MEDIA_FRAME';
const RESPONSE_OUTGOING_MESSAGE_TYPE = 'NEW_MEDIA_FRAME_RESULT';

type IncomingMessage = BaseIncomingMessage<
  typeof MESSAGE_TYPE,
  {
    data: Buffer;
  }
>;

type ResponseOutgoingMessage = BaseOutgoingMessage<
  typeof RESPONSE_OUTGOING_MESSAGE_TYPE,
  {
    message: string;
  }
>;

export default createResolverByMessageType<IncomingMessage, ResponseOutgoingMessage>(MESSAGE_TYPE, {
  responseOutgoingMessageType: RESPONSE_OUTGOING_MESSAGE_TYPE,
  middleware: [],
  async execute({ client, message }) {
    pubsub.publish('NEW_MEDIA_FRAME', {
      data: message.payload.data!,
    });

    return {
      message: 'Success',
    };
  },
});
