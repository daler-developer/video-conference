import {
  BaseOutgoingErrorMessage,
  createOutgoingErrorMessageCreator,
} from '../createOutgoingErrorMessageCreator';

const ERROR_TYPE = 'VALIDATION';

type OutgoingMessage = BaseOutgoingErrorMessage<
  typeof ERROR_TYPE,
  {
    messageId: string;
  },
  object
>;

export const createOutgoingValidationErrorMessage =
  createOutgoingErrorMessageCreator<OutgoingMessage>({
    errorType: ERROR_TYPE,
  });
