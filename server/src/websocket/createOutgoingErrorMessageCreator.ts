import { BaseOutgoingMessage } from './types';
import { createOutgoingMessageCreator } from './createOutgoingMessageCreator';

const MESSAGE_TYPE = 'ERROR';

export type BaseOutgoingErrorMessage<
  TErrorType extends string = string,
  TMessageMeta extends
    BaseOutgoingMessage['meta'] = BaseOutgoingMessage['meta'],
  TDetails extends BaseOutgoingMessage['meta'] = BaseOutgoingMessage['meta'],
> = BaseOutgoingMessage<
  typeof MESSAGE_TYPE,
  TMessageMeta,
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
  meta: TOutgoingMessage['meta'];
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

  return ({ message, details, meta }: CallbackOptions<TOutgoingMessage>) => {
    return createMessage({
      meta,
      payload: {
        errorType,
        message,
        details,
      },
    });
  };
};
