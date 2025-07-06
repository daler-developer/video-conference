import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import { BaseIncomingMessage, BaseOutgoingMessage } from '../../types';

const INCOMING_MESSAGE_TYPE = 'START_SESSION';
const OUTGOING_MESSAGE_TYPE = 'START_SESSION_RESULT';

type IncomingMessage = BaseIncomingMessage<
  typeof INCOMING_MESSAGE_TYPE,
  {
    fullName: string;
  }
>;

type OutgoingMessage = BaseOutgoingMessage<
  typeof OUTGOING_MESSAGE_TYPE,
  {
    accessToken: string;
  }
>;

export default createResolverByMessageType<IncomingMessage, OutgoingMessage>({
  incomingMessageType: INCOMING_MESSAGE_TYPE,
  outgoingMessageType: OUTGOING_MESSAGE_TYPE,
  // validator: z.object({
  //   params: z.object({
  //     fullName: z.string(),
  //   }),
  // }),
  middleware: [],
  async execute({ client, message, ctx }) {
    return {
      accessToken: 'test_accessToken2',
    };
  },
});
