type JsonValue =
  | string
  | number
  | boolean
  | ArrayBuffer
  | JsonValue[]
  | { [key: string]: JsonValue };

export type BaseOutgoingMessagePayload = { [key: string]: JsonValue };

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

export type OutgoingMessageExtractType<T> =
  T extends BaseOutgoingMessage<infer U> ? U : never;

export type OutgoingMessageExtractPayload<T> =
  T extends BaseOutgoingMessage<infer _, infer U> ? U : never;

export type IncomingMessageExtractType<T> =
  T extends BaseIncomingMessage<infer U> ? U : never;

export type IncomingMessageExtractPayload<T> =
  T extends BaseIncomingMessage<infer _, infer U> ? U : never;

export type OutgoingMessagePayload<
  TOutgoingMessage extends BaseOutgoingMessage,
> = TOutgoingMessage extends BaseOutgoingMessage<infer U> ? U : never;

export type BaseIncomingMessagePayload = { [key: string]: JsonValue };

export type BaseIncomingErrorMessage<
  TErrorType extends string = string,
  TErrorDetails extends Record<string, any> = Record<string, any>,
> = BaseIncomingMessage<
  "ERROR",
  {
    message: string;
    errorType: TErrorType;
    details: TErrorDetails;
  }
>;
