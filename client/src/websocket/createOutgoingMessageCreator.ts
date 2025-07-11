import { type BaseOutgoingMessage } from "./types";
import { prepareMeta } from "./utils.ts";

type Options<TOutgoingMessage extends BaseOutgoingMessage> = {
  type: TOutgoingMessage["type"];
};

export const createOutgoingMessageCreator = <
  TOutgoingMessage extends BaseOutgoingMessage,
>({
  type,
}: Options<TOutgoingMessage>) => {
  return ({
    payload,
  }: {
    payload: TOutgoingMessage["payload"];
  }): TOutgoingMessage => {
    return {
      type,
      payload,
      meta: prepareMeta(),
    } as TOutgoingMessage;
  };
};
