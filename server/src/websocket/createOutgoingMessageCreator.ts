import { BaseOutgoingMessage } from './types';

type Options = {
  type: string;
};

export const createOutgoingMessageCreator = <TMessagePayload extends BaseOutgoingMessage['payload']>(type: string) => {
  return (payload: TMessagePayload): Pick<BaseOutgoingMessage, 'payload' | 'type'> => {
    return {
      type,
      payload,
    };
  };
};
