import { type Schema, normalize, denormalize } from "normalizr";
import { createEntityState, type EntityState } from "./createEntityState.ts";

type State = {
  users: EntityState;
  messages: EntityState;
};

export type EntityName = keyof State;

type Update = {
  id: number;
  changes: Record<string, any>;
};

export class EntityRepository {
  #state: State = {
    users: createEntityState(),
    messages: createEntityState(),
  };

  getAll() {
    const res = {};
    for (const entityName of Object.keys(this.#state)) {
      res[entityName] = this.#state[entityName].byId;
    }
    return res;
  }

  updateOne(entityName: EntityName, update: Update) {
    const oldEntity = this.#state[entityName][update.id];

    this.#state[entityName][update.id] = {
      ...oldEntity,
      ...update.changes,
    };
  }

  addOne(entityName: EntityName, entity: any) {
    this.#state[entityName].byId[entity.id] = entity;
  }
}
