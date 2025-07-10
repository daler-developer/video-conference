import { BaseOutgoingMessage } from './types';
import { createOutgoingMessageCreator } from './createOutgoingMessageCreator';

const MESSAGE_TYPE = 'ERROR';

export type BaseOutgoingErrorMessage<
  TErrorType extends string = string,
  TDetails extends BaseOutgoingMessage['meta'] = BaseOutgoingMessage['meta'],
> = BaseOutgoingMessage<
  typeof MESSAGE_TYPE,
  {
    errorType: TErrorType;
    message: string;
    details: TDetails;
  }
>;

type Options<TOutgoingMessage extends BaseOutgoingErrorMessage> = {
  errorType: TOutgoingMessage['payload']['errorType'];
};

type CallbackOptions<TOutgoingMessage extends BaseOutgoingErrorMessage> = {
  message: TOutgoingMessage['payload']['message'];
  details: TOutgoingMessage['payload']['details'];
};

export const createOutgoingErrorMessageCreator = <
  TOutgoingMessage extends BaseOutgoingErrorMessage,
>({
  errorType,
}: Options<TOutgoingMessage>) => {
  const createMessage = createOutgoingMessageCreator<TOutgoingMessage>({
    type: MESSAGE_TYPE,
  });

  return ({ message, details }: CallbackOptions<TOutgoingMessage>) => {
    return createMessage({
      payload: {
        errorType,
        message,
        details,
      },
    });
  };
};
