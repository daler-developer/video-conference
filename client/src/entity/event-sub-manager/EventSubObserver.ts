import { EventSub, type EventSubOptions } from "./EventSub";
import type {
  EventSubBaseData,
  EventSubBaseParams,
} from "@/entity/utils/createEventSub.ts";
import { eventSubManager } from "@/entity/event-sub-manager/EventSubManager.ts";

export type EventSubObserverConfig<
  TEventSubParams extends EventSubBaseParams,
  TEventSubData extends EventSubBaseData,
> = EventSubOptions<TEventSubParams, TEventSubData> & {};

export class EventSubObserver<
  TEventSubParams extends EventSubBaseParams,
  TEventSubData extends EventSubBaseData,
> {
  #eventSub: EventSub<TEventSubParams, TEventSubData>;

  constructor(config: EventSubObserverConfig<TEventSubParams, TEventSubData>) {
    const existingEventSub = eventSubManager.get<
      TEventSubParams,
      TEventSubData
    >(config);

    if (existingEventSub) {
      existingEventSub.observersCount++;
      this.#eventSub = existingEventSub;
      return;
    }

    const newEventSub = eventSubManager.add(config);
    newEventSub.observersCount = 1;
    this.#eventSub = newEventSub;
  }

  ensureSubscribed({ params }: { params: TEventSubParams }) {
    if (!this.#eventSub.isSubscribed) {
      return;
    }

    this.#eventSub.subscribe({ params });
  }

  onDestroyed() {
    this.#eventSub.unsubscribe();
  }
}
