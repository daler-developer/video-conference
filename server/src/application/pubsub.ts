import EventEmitter from 'node:events';
import WebSocket from 'ws';
import { Conference } from '@/domain';

export type ApplicationEvents = {
  USER_JOINED_CONFERENCE: {
    conferenceId: string;
    userId: number;
  };
  USER_STARTED_CONFERENCE: {
    conference: Conference;
  };
  USER_SENT_NEW_MEDIA_FRAME: {
    data: any;
  };
};

export type ApplicationEventName = keyof ApplicationEvents;

class PubSub {
  private emitter = new EventEmitter();

  public subscribe<TEventName extends ApplicationEventName>(
    channelName: TEventName,
    callback: (payload: ApplicationEvents[TEventName]) => void
  ) {
    this.emitter.on(channelName, callback);

    return () => {
      this.emitter.off(channelName, callback);
    };
  }

  public publish<TEventName extends ApplicationEventName>(
    eventName: TEventName,
    payload: ApplicationEvents[TEventName]
  ) {
    this.emitter.emit(eventName, payload);
  }
}

export const applicationPubSub = new PubSub();
