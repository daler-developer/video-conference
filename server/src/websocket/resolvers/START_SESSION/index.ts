import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import { BaseIncomingMessage, BaseOutgoingMessage } from '../../types';
import { createApplicationContext, StartSessionCommandUseCase } from '@/application';
import { CreateUserDto } from '@/domain';

const START_SESSION = 'START_SESSION';

type IncomingPayload = {
  fullName: string;
};

type OutgoingPayload = {
  accessToken: string;
};

export default createResolverByMessageType<IncomingPayload, OutgoingPayload>(START_SESSION, {
  validator() {
    return true;
  },
  middleware: [],
  async execute({ ctx, payload }) {
    const createUserDto = new CreateUserDto(payload.fullName);

    const result = await ctx.useCaseRunner.run(StartSessionCommandUseCase, createUserDto);

    return {
      accessToken: result.accessToken,
    };
  },
});
