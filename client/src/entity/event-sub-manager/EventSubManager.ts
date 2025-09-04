import { EventSub, type EventSubOptions } from "./EventSub";
import type {
  EventSubBaseData,
  EventSubBaseParams,
} from "@/entity/utils/createEventSub.ts";

type HashEventSubOptions<
  TEventSubParams extends EventSubBaseParams,
  TEventSubData extends EventSubBaseData,
> = {
  name: string;
  params: TEventSubParams;
};

class EventSubManager {
  #eventSubs = new Map<string, EventSub<any, any>>();

  constructor() {}

  static hashEventSub<
    TEventSubParams extends EventSubBaseParams,
    TEventSubData extends EventSubBaseData,
  >({ name, params }: HashEventSubOptions<TEventSubParams, TEventSubData>) {
    return `${name}|${JSON.stringify(params)}`;
  }

  get<
    TEventSubParams extends EventSubBaseParams,
    TEventSubData extends EventSubBaseData,
  >({
    name,
    params,
  }: Pick<EventSubOptions<TEventSubParams, TEventSubData>, "name" | "params">) {
    const hash = EventSub.hashEventSub({ name, params });

    return this.#eventSubs.get(hash) as EventSub<
      TEventSubParams,
      TEventSubData
    >;
  }

  add<
    TEventSubParams extends EventSubBaseParams,
    TEventSubData extends EventSubBaseData,
  >(options: EventSubOptions<TEventSubParams, TEventSubData>) {
    const eventSub = new EventSub(options);
    this.#eventSubs.set(eventSub.hash, eventSub);
    return eventSub;
  }

  delete<
    TEventSubParams extends EventSubBaseParams,
    TEventSubData extends EventSubBaseData,
  >(eventSub: EventSub<TEventSubParams, TEventSubData>) {
    return this.#eventSubs.delete(eventSub.hash);
  }
}

export const eventSubManager = new EventSubManager();
