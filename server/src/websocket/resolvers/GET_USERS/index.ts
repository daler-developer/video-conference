import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import { BaseIncomingMessage, BaseOutgoingMessage } from '../../types';
import { BaseError } from '../../errors';
import { createOutgoingMessageCreator } from '../../createOutgoingMessageCreator';

const MESSAGE_TYPE = 'GET_USERS';
const OUTGOING_MESSAGE_TYPE = 'GET_USERS_RESULT';

type IncomingMessage = BaseIncomingMessage<
  typeof MESSAGE_TYPE,
  {
    limit: number;
    search: string;
  }
>;

type OutgoingResponseMessage = BaseOutgoingMessage<
  typeof OUTGOING_MESSAGE_TYPE,
  {
    list: Array<{ id: number; name: string; age: number }>;
  }
>;

export default createResolverByMessageType<IncomingMessage, OutgoingResponseMessage>(MESSAGE_TYPE, {
  responseOutgoingMessageType: OUTGOING_MESSAGE_TYPE,
  validator() {
    return true;
  },
  middleware: [],
  execute({ client, message, respond }) {
    respond({
      payload: {
        list: [
          {
            id: 1,
            name: 'Daler',
            age: 20,
          },
          {
            id: 2,
            name: 'Aziz',
            age: 20,
          },
        ],
      },
    });
  },
});
