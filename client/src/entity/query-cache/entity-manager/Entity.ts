import { Subscribable } from "../Subscribable";

type EntityNotifyEvent = {
  type: "data-updated";
};

type Listener = (event: EntityNotifyEvent) => void;

export type BaseEntity = {
  id: number;
};

export class Entity<
  TData extends BaseEntity = BaseEntity,
> extends Subscribable<Listener> {
  #data: TData;

  constructor(data: TData) {
    super();
    this.#data = data;
  }

  getData() {
    return this.#data;
  }

  updateData(changes: Partial<TData>) {
    this.#data = {
      ...this.#data,
      ...changes,
    };

    this.notify({
      type: "data-updated",
    });
  }

  private notify(event: EntityNotifyEvent) {
    this.listeners.forEach((listener) => {
      listener(event);
    });
  }
}
