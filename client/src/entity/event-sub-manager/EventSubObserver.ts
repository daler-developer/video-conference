import { EventSub, type EventSubOptions } from "./EventSub";
import type {
  EventSubBaseData,
  EventSubBaseParams,
} from "@/entity/utils/createEventSub.ts";
import { eventSubManager } from "@/entity/event-sub-manager/EventSubManager.ts";
import { eventSubEmitter } from "@/entity/event-sub-manager/EventSubEmitter.ts";

export type EventSubObserverConfig<
  TEventSubParams extends EventSubBaseParams,
  TEventSubData extends EventSubBaseData,
> = EventSubOptions<TEventSubParams, TEventSubData> & {
  onData: (options: { data: TEventSubData }) => void;
};

export type EventSubObserverOptions<TEventSubData extends EventSubBaseData> = {
  onData: (options: { data: TEventSubData }) => void;
};

export class EventSubObserver<
  TEventSubParams extends EventSubBaseParams,
  TEventSubData extends EventSubBaseData,
> {
  #eventSub: EventSub<TEventSubParams, TEventSubData>;
  #options: EventSubObserverOptions<TEventSubData>;

  constructor(config: EventSubObserverConfig<TEventSubParams, TEventSubData>) {
    const existingEventSub = eventSubManager.get<
      TEventSubParams,
      TEventSubData
    >(config);
    this.#options = {
      onData: config.onData,
    };

    if (existingEventSub) {
      existingEventSub.observersCount++;
      this.#eventSub = existingEventSub;
      this.subscribeToNewData();
      return;
    }

    const newEventSub = eventSubManager.add(config);
    newEventSub.observersCount = 1;
    this.#eventSub = newEventSub;
    this.subscribeToNewData();
  }

  subscribeToNewData() {
    eventSubEmitter.on("NEW_DATA", ({ eventSubHash, data }) => {
      if (this.#eventSub.hash === eventSubHash) {
        this.#options.onData({ data: data as TEventSubData });
      }
    });
  }

  ensureSubscribed({ params }: { params: TEventSubParams }) {
    if (this.#eventSub.isSubscribed) {
      return;
    }

    this.#eventSub.subscribe({ params });
  }

  onDestroyed() {
    this.#eventSub.observersCount--;

    if (this.#eventSub.observersCount === 0) {
      this.#eventSub.unsubscribe();
      eventSubManager.delete(this.#eventSub);
    }
  }
}
