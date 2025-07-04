import { sendMessage, onMessage } from "./connection";
import type { BaseOutgoingMessagePayload } from "./types.ts";
import { prepareMeta } from "./utils.ts";

type Options = {
  type: string;
};

export const createMessageSender = <
  TMessagePayload extends BaseOutgoingMessagePayload,
>({
  type,
}: Options) => {
  return ({ payload }: { payload: TMessagePayload }) => {
    const message = {
      type,
      payload,
      meta: prepareMeta(),
    };

    sendMessage(message);

    // return new Promise((res) => {
    //   const off = onMessage((message) => {
    //     if (
    //       message.type === "RESPONSE" &&
    //       message.payload.messageId === messageId
    //     ) {
    //       off();
    //       res(message);
    //     }
    //   });
    //
    //   // setTimeout(() => {
    //   //   off();
    //   //   rej();
    //   // }, 5000);
    // });
  };
};
