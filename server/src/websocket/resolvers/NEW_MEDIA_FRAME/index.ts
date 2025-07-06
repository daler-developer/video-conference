import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import pubsub from '../../pubsub';
import { BaseIncomingMessage, BaseOutgoingMessage } from '../../types';

const INCOMING_MESSAGE_TYPE = 'NEW_MEDIA_FRAME';
const OUTGOING_MESSAGE_TYPE = 'NEW_MEDIA_FRAME_RESULT';

type IncomingMessage = BaseIncomingMessage<
  typeof INCOMING_MESSAGE_TYPE,
  {
    data: Buffer;
  }
>;

type OutgoingMessage = BaseOutgoingMessage<
  typeof OUTGOING_MESSAGE_TYPE,
  {
    message: string;
  }
>;

export default createResolverByMessageType<IncomingMessage, OutgoingMessage>({
  incomingMessageType: INCOMING_MESSAGE_TYPE,
  outgoingMessageType: OUTGOING_MESSAGE_TYPE,
  middleware: [],
  async execute({ client, message, ctx }) {
    pubsub.publish('NEW_MEDIA_FRAME', {
      data: message.payload.data!,
    });

    return {
      message: 'Success',
    };
  },
});
