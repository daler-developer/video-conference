import { BaseOutgoingMessage } from './types';

type Options<TOutgoingMessage extends BaseOutgoingMessage> = {
  type: TOutgoingMessage['type'];
};

export const createOutgoingMessageCreator = <
  TOutgoingMessage extends BaseOutgoingMessage,
>({
  type,
}: Options<TOutgoingMessage>) => {
  return ({
    payload,
    meta,
  }: {
    payload: TOutgoingMessage['payload'];
    meta: TOutgoingMessage['meta'];
  }) => {
    return {
      type,
      meta,
      payload,
    };
  };
};
