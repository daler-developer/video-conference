import createResolverByMessageType from '../../createResolverByMessageType';
import { z } from 'zod/v4';
import pubsub from '../../pubsub';
import { BaseIncomingMessage, BaseOutgoingMessage } from '../../types';

const NEW_MEDIA_FRAME = 'NEW_MEDIA_FRAME';

type IncomingPayload = {
  data: Buffer;
};

type OutgoingPayload = {
  message: string;
};

export default createResolverByMessageType<IncomingPayload, OutgoingPayload>(NEW_MEDIA_FRAME, {
  middleware: [],
  async execute({ client, payload }) {
    pubsub.publish('NEW_MEDIA_FRAME', {
      data: payload.data!,
    });

    return {
      message: 'Success',
    };
  },
});
