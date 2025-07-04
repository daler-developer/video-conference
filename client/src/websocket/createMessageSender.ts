import { sendMessage, onMessage } from "./connection";
import type { BaseIncomingMessage, BaseOutgoingMessage } from "./types.ts";
import { prepareMeta } from "./utils.ts";

type Options<
  TOutgoingMessage extends BaseOutgoingMessage,
  TIncomingMessage extends BaseIncomingMessage,
> = {
  outgoingMessageType: TOutgoingMessage["type"];
  incomingMessageType: TIncomingMessage["type"];
};

type MessageSenderResult<TIncomingMessage extends BaseIncomingMessage> =
  Promise<{
    response: TIncomingMessage;
  }>;

export const createMessageSender = <
  TOutgoingMessage extends BaseOutgoingMessage,
  TIncomingMessage extends BaseIncomingMessage,
>({
  outgoingMessageType,
  incomingMessageType,
}: Options<TOutgoingMessage, TIncomingMessage>) => {
  return async ({
    payload,
  }: {
    payload: TOutgoingMessage["payload"];
  }): MessageSenderResult<TIncomingMessage> => {
    const outgoingMessage = {
      type: outgoingMessageType,
      payload,
      meta: prepareMeta(),
    };

    sendMessage(outgoingMessage);

    // return new Promise((res) => {
    //   setTimeout(() => {
    //     res({
    //       response: { foo: "bar" }
    //     });
    //   }, 2000);
    // });

    return new Promise((res) => {
      const unsubscribe = onMessage((message) => {
        if (
          message.type === incomingMessageType &&
          message.meta.messageId === outgoingMessage.meta.messageId
        ) {
          unsubscribe();
          res({
            response: message as TIncomingMessage,
          });
        }
      });

      // setTimeout(() => {
      //   off();
      //   rej();
      // }, 5000);
    });
  };
};
