import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import { BaseIncomingMessage, BaseOutgoingMessage } from '../../types';
import { GetUsersQueryUseCase, useCaseManager } from '../../../application';

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
  async execute({ client, message, respond, ctx }) {
    const result = await useCaseManager.run(GetUsersQueryUseCase, {
      limit: message.payload.limit,
      page: message.payload.page,
    });

    respond({
      payload: {
        list: result,
      },
    });

    // const page = message.payload.page;
    // console.log('page', page);
    // respond({
    //   payload: {
    //     list: [
    //       {
    //         id: page * 2,
    //         name: 'Daler',
    //         age: getRandom1to10(),
    //       },
    //       {
    //         id: page * 2 + 1,
    //         name: 'Aziz',
    //         age: getRandom1to10(),
    //       },
    //     ],
    //   },
    // });
  },
});
