import EventEmitter from 'node:events';
import WebSocket from 'ws';

export type CHANNEL_PAYLOAD_MAP = {
  CONFERENCE_NEW_PARTICIPANT_JOINED: {
    conferenceId: string;
    participantId: string;
  };
  CONFERENCE_PARTICIPANT_LEFT: {
    conferenceId: string;
    participantId: string;
  };
  NEW_MEDIA_FRAME: {
    data: any;
  };
  EVENT_UNSUB: { ws: WebSocket };
};

export type CHANNEL_NAME = keyof CHANNEL_PAYLOAD_MAP;

class PubSub {
  private emitter = new EventEmitter();

  public subscribe<TChannelName extends CHANNEL_NAME>(
    channelName: TChannelName,
    callback: (payload: CHANNEL_PAYLOAD_MAP[TChannelName]) => void
  ) {
    this.emitter.on(channelName, callback);

    return () => {
      this.emitter.off(channelName, callback);
    };
  }

  public publish<TEventName extends CHANNEL_NAME>(
    eventName: TEventName,
    payload: CHANNEL_PAYLOAD_MAP[TEventName]
  ) {
    this.emitter.emit(eventName, payload);
  }
}

export default new PubSub();
