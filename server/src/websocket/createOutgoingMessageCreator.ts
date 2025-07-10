import { BaseOutgoingMessage } from './types';

type Options<TOutgoingMessage extends BaseOutgoingMessage> = {
  type: TOutgoingMessage['type'];
};

export const createOutgoingMessageCreator = <
  TOutgoingMessage extends BaseOutgoingMessage,
>({
  type,
}: Options<TOutgoingMessage>) => {
  return ({ payload }: { payload: TOutgoingMessage['payload'] }) => {
    return {
      type,
      payload,
    };
  };
};
