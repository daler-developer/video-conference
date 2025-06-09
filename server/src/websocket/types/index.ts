export type MESSAGE_TYPE = 'EVENT_SUB' | 'EVENT_UNSUB' | 'START_SESSION';

export type EVENT_NAME =
  | 'NEW_AUDIO_CHUNK'
  | 'CONFERENCE_NEW_PARTICIPANT_JOINED'
  | 'CONFERENCE_NEW_PARTICIPANT_LEAVED'
  | 'NEW_MEDIA_FRAME';

type BaseMessage<T, V> = {
  type: MESSAGE_TYPE;
} & V;

type BaseEventSubMessage<T extends EVENT_NAME, V> = BaseMessage<
  'EVENT_SUB',
  {
    eventName: T;
  } & V
>;

type ConferenceNewParticipantJoinedMessage = BaseEventSubMessage<
  'CONFERENCE_NEW_PARTICIPANT_JOINED',
  {
    params: {
      conferenceId: string;
      participantId: string;
    };
  }
>;

type ConferenceParticipantLeavedMessage = BaseEventSubMessage<
  'CONFERENCE_NEW_PARTICIPANT_LEAVED',
  {
    params: {
      conferenceId: string;
      participantId: string;
    };
  }
>;

type EventUnsubMessage = {
  type: 'EVENT_UNSUB';
  eventName: EVENT_NAME;
};

export type Message =
  | ConferenceNewParticipantJoinedMessage
  | ConferenceParticipantLeavedMessage
  | EventUnsubMessage;
