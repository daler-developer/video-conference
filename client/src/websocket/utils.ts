import websocketClient from "../WebsocketClient.ts";
import { v4 as uuidv4 } from "uuid";

type Options = {
  type: string;
};

const prepareMeta = () => {
  return {
    messageId: uuidv4(),
  };
};

export const createMessageSender = <
  TMessagePayload extends { [key: string]: unknown },
>({
  type,
}: Options) => {
  return ({ payload }: { payload: TMessagePayload }) => {
    const meta = prepareMeta();

    websocketClient.sendMessage({
      type,
      meta,
      payload,
    });

    // return new Promise((res) => {
    //   const off = websocketClient.onMessage((message) => {
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
