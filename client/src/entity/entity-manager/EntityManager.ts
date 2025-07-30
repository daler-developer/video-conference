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

export class EntityManager {
  private state: State = {
    users: createEntityState(),
    messages: createEntityState(),
  };

  getAllEntities() {
    const res = {};
    for (const entityName of Object.keys(this.state)) {
      res[entityName] = this.state[entityName].byId;
    }
    return res;
  }

  public updateEntity(entityName: EntityName, update: Update) {
    const oldEntity = this.state[entityName][update.id];

    this.state[entityName][update.id] = {
      ...oldEntity,
      ...update.changes,
    };
  }

  public addEntity(entityName: EntityName, entity: any) {
    this.state[entityName].byId[entity.id] = entity;
  }
}

export const entityManager = new EntityManager();
