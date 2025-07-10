export type EVENT_NAME =
  | 'NEW_AUDIO_CHUNK'
  | 'CONFERENCE_NEW_PARTICIPANT_JOINED'
  | 'CONFERENCE_NEW_PARTICIPANT_LEAVED'
  | 'NEW_MEDIA_FRAME';

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
