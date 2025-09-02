import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import { BaseIncomingMessage, BaseOutgoingMessage } from '../../types';
import { StartSessionCommandUseCase } from '../../../application/commands/StartSession/StartSessionCommand';

const MESSAGE_TYPE = 'START_SESSION';
const OUTGOING_MESSAGE_TYPE = 'START_SESSION_RESULT';

type IncomingMessage = BaseIncomingMessage<
  typeof MESSAGE_TYPE,
  {
    fullName: string;
  }
>;

type OutgoingResponseMessage = BaseOutgoingMessage<
  typeof OUTGOING_MESSAGE_TYPE,
  {
    accessToken: string;
  }
>;

export default createResolverByMessageType<IncomingMessage, OutgoingResponseMessage>(MESSAGE_TYPE, {
  responseOutgoingMessageType: OUTGOING_MESSAGE_TYPE,
  validator() {
    return true;
  },
  middleware: [],
  async execute({ ctx, message }) {
    const result = await ctx.useCaseManager.run(StartSessionCommandUseCase, {
      fullName: message.payload.fullName,
    });

    return {
      accessToken: result.accessToken,
    };
  },
});
