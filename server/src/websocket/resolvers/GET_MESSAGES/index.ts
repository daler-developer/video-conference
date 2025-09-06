import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import { BaseIncomingMessage, BaseOutgoingMessage } from '../../types';
import { GetMessagesQueryUseCase, GetUsersQueryUseCase, useCaseManager } from '@/application';
import { Message } from '@/application/queries/GetMessages/GetMessagesQuery';

const GET_MESSAGES = 'GET_MESSAGES';

type IncomingPayload = {};

type OutgoingPayload = {
  list: Message[];
};

export default createResolverByMessageType<IncomingPayload, OutgoingPayload>(GET_MESSAGES, {
  validator({ payload }) {
    return true;
    // return message.payload.page < 5;
  },
  middleware: [],
  async execute({ client, payload, ctx }) {
    const result = await useCaseManager.run(GetMessagesQueryUseCase, {});

    return {
      list: result,
    };
  },
});
