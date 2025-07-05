type JsonValue =
  | string
  | number
  | boolean
  | JsonValue[]
  | { [key: string]: JsonValue };

export type BaseOutgoingMessagePayload = { [key: string]: unknown };

export type BaseOutgoingMessageMeta = {
  messageId: string;
};

export type BaseOutgoingMessage<
  TMessageType extends string = string,
  TMessagePayload extends
    BaseOutgoingMessagePayload = BaseOutgoingMessagePayload,
> = {
  type: TMessageType;
  payload: TMessagePayload;
  meta: BaseOutgoingMessageMeta;
};

export type BaseIncomingMessagePayload = { [key: string]: JsonValue };

export type BaseIncomingMessage<
  TMessageType extends string = string,
  TMessagePayload extends
    BaseIncomingMessagePayload = BaseIncomingMessagePayload,
> = {
  type: TMessageType;
  payload: TMessagePayload;
  meta: {
    messageId?: string;
  };
};
