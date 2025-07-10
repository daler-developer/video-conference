import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import { BaseIncomingMessage, BaseOutgoingMessage } from '../../types';
import { BaseError } from '../../errors';
import { createOutgoingMessageCreator } from '../../createOutgoingMessageCreator';

const MESSAGE_TYPE = 'START_SESSION';
const OUTGOING_MESSAGE_TYPE = 'START_SESSION_RESULT';

type IncomingMessage = BaseIncomingMessage<
  typeof MESSAGE_TYPE,
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

const createStartMessageResultMessage =
  createOutgoingMessageCreator<OutgoingMessage>({
    type: OUTGOING_MESSAGE_TYPE,
  });

export default createResolverByMessageType<IncomingMessage>(MESSAGE_TYPE, {
  validator() {
    return true;
  },
  middleware: [],
  execute({ client, message, ctx }) {
    client.respondTo(
      message,
      createStartMessageResultMessage({
        payload: {
          accessToken: 'Hello World',
        },
      })
    );
  },
});
