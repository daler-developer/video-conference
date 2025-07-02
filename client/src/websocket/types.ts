export type BaseOutgoingMessage<
  TMessageType extends string,
  TMessagePayload extends { [key: string]: unknown },
> = {
  type: TMessageType;
  payload: TMessagePayload;
};

export type BaseIncomingMessage<
  TMessageType extends string,
  TMessagePayload extends { [key: string]: unknown },
> = {
  type: TMessageType;
  payload: TMessagePayload;
  meta: {
    responseTo?: string;
  };
};
