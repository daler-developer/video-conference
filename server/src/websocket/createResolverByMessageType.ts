import WebSocketWrapper from './WebSocketWrapper';
import { BaseIncomingMessage, BaseOutgoingMessage } from './types';

type Options<
  TIncomingMessage extends BaseIncomingMessage,
  TOutgoingMessage extends BaseOutgoingMessage,
> = {
  type: TIncomingMessage['type'];
  middleware: any[];
  execute: (options: {
    ctx: any;
    message: TIncomingMessage;
    client: WebSocketWrapper;
  }) => Promise<TOutgoingMessage['payload']>;
  validator?: (options: { message: TIncomingMessage }) => boolean;
  init?: () => void;
};

const createResolverByMessageType = <
  TIncomingMessage extends BaseIncomingMessage,
  TOutgoingMessage extends BaseOutgoingMessage,
>(
  options: Options<TIncomingMessage, TOutgoingMessage>
) => {
  return options;
};

export default createResolverByMessageType;
