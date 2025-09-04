import type {
  EventSubBaseData,
  EventSubBaseParams,
} from "@/entity/utils/createEventSub.ts";
import { Subscribable } from "@/entity/query-cache/Subscribable.ts";
import { eventSubEmitter } from "@/entity/event-sub-manager/EventSubEmitter.ts";

type HashEventSubOptions<
  TEventSubParams extends EventSubBaseParams,
  TEventSubData extends EventSubBaseData,
> = {
  name: string;
  params: TEventSubParams;
};

export type EventSubCallback<
  TEventSubParams extends EventSubBaseParams,
  TEventSubData extends EventSubBaseData,
> = (options: {
  params: TEventSubParams;
  onData: (a: { data: TEventSubData }) => void;
}) => {
  unsubscribe: () => void;
};

export type EventSubOptions<
  TEventSubParams extends EventSubBaseParams,
  TEventSubData extends EventSubBaseData,
> = {
  name: string;
  params: TEventSubParams;
  callback: EventSubCallback<TEventSubParams, TEventSubData>;
  update: (options: { data: TEventSubData }) => void;
};

type Listener = () => void;

export class EventSub<
  TEventSubParams extends EventSubBaseParams,
  TEventSubData extends EventSubBaseData,
> {
  #options: EventSubOptions<TEventSubParams, TEventSubData>;
  #observersCount: number = 0;
  #isSubscribed: boolean = false;
  #unsubscribeFn: null | (() => void) = null;

  constructor(options: EventSubOptions<TEventSubParams, TEventSubData>) {
    this.#options = options;
  }

  subscribe({ params }: { params: TEventSubParams }) {
    const { unsubscribe } = this.#options.callback({
      params,
      onData: ({ data }) => {
        this.#options.update({ data });
        eventSubEmitter.emit("NEW_DATA", {
          eventSubHash: EventSub.hashEventSub({
            name: this.#options.name,
            params: this.#options.params,
          }),
          data: data,
        });
      },
    });
    this.#isSubscribed = true;
    this.#unsubscribeFn = unsubscribe;

    return unsubscribe;
  }

  unsubscribe() {
    if (!this.#isSubscribed) {
      throw new Error("Not subscribed");
    }

    this.#unsubscribeFn!();
  }

  static hashEventSub<
    TEventSubParams extends EventSubBaseParams,
    TEventSubData extends EventSubBaseData,
  >({ name, params }: HashEventSubOptions<TEventSubParams, TEventSubData>) {
    return `${name}|${JSON.stringify(params)}`;
  }

  get hash() {
    return EventSub.hashEventSub({
      name: this.#options.name,
      params: this.#options.params,
    });
  }

  get observersCount() {
    return this.#observersCount;
  }

  set observersCount(value: number) {
    this.#observersCount = value;
  }

  get isSubscribed() {
    return this.#isSubscribed;
  }
}
