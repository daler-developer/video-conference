import {
  type BaseOutgoingMessage,
  type BaseOutgoingMessagePayload,
} from "./types";
import { prepareMeta } from "./utils.ts";

type Options<TMessageType extends string> = {
  type: TMessageType;
};

export const createOutgoingMessageCreator = <
  TMessagePayload extends BaseOutgoingMessagePayload,
  TMessageType extends string,
>({
  type,
}: Options<TMessageType>) => {
  return ({
    payload,
  }: {
    payload: TMessagePayload;
  }): BaseOutgoingMessage<TMessageType, TMessagePayload> => {
    return {
      type,
      payload,
      meta: prepareMeta(),
    };
  };
};

export type OutgoingMessageCreator<
  TMessagePayload extends BaseOutgoingMessagePayload,
  TMessageType extends string,
> = ReturnType<
  typeof createOutgoingMessageCreator<TMessagePayload, TMessageType>
>;
