import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import { BaseIncomingMessage, BaseOutgoingMessage } from '../../types';
import { GetUsersQueryUseCase, useCaseManager } from '@/application';

const GET_USERS = 'GET_USERS';
const OUTGOING_MESSAGE_TYPE = 'GET_USERS_RESULT';

type IncomingPayload = {
  limit: number;
  search: string;
  page: number;
};

type OutgoingPayload = {
  list: Array<{ id: number; name: string; age: number }>;
};

function getRandom1to10() {
  return Math.floor(Math.random() * 10) + 1;
}

let counter = 0;

export default createResolverByMessageType<IncomingPayload, OutgoingPayload>(GET_USERS, {
  validator({ payload }) {
    return true;
    // return message.payload.page < 5;
  },
  middleware: [],
  async execute({ client, payload, ctx }) {
    const result = await useCaseManager.run(GetUsersQueryUseCase, {
      limit: payload.limit,
      page: payload.page,
    });

    return {
      list: result,
    };

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
