import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import { BaseIncomingMessage, BaseOutgoingMessage } from '../../types';
import { StartSessionCommandUseCase } from '@/application';

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
    const result = await ctx.useCaseManager.run(StartSessionCommandUseCase, {
      fullName: payload.fullName,
    });

    return {
      accessToken: result.accessToken,
    };
  },
});
