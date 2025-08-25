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
    page: number;
  }
>;

type OutgoingResponseMessage = BaseOutgoingMessage<
  typeof OUTGOING_MESSAGE_TYPE,
  {
    list: Array<{ id: number; name: string; age: number }>;
  }
>;

function getRandom1to10() {
  return Math.floor(Math.random() * 10) + 1;
}

let counter = 0;

export default createResolverByMessageType<IncomingMessage, OutgoingResponseMessage>(MESSAGE_TYPE, {
  responseOutgoingMessageType: OUTGOING_MESSAGE_TYPE,
  validator({ message }) {
    return true;
    // return message.payload.page < 5;
  },
  middleware: [],
  execute({ client, message, respond }) {
    const page = message.payload.page;

    // console.log('page', page);

    respond({
      payload: {
        list: [
          {
            id: page * 2,
            name: 'Daler',
            age: getRandom1to10(),
          },
          {
            id: page * 2 + 1,
            name: 'Aziz',
            age: getRandom1to10(),
          },
        ],
      },
    });
  },
});
