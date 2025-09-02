export type BaseIncomingMessage<
  TMessageType extends string = string,
  TMessagePayload extends Record<string, any> = Record<string, any>,
> = {
  type: TMessageType;
  payload: TMessagePayload;
  meta: {
    messageId: string;
  };
};

export type BaseOutgoingMessage<
  TMessageType extends string = string,
  TMessagePayload extends Record<string, any> = Record<string, any>,
> = {
  type: TMessageType;
  payload: TMessagePayload;
  meta: {
    messageId?: string;
  };
};
