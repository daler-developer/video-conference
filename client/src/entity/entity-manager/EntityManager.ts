import { type Schema, normalize, denormalize } from "normalizr";
import { createEntityState, type EntityState } from "./createEntityState.ts";

type State = {
  users: EntityState;
  messages: EntityState;
};

type EntityName = keyof State;

type Update = {
  id: number;
  changes: Record<string, any>;
};

export class EntityManager {
  private state: State = {
    users: createEntityState(),
    messages: createEntityState(),
  };

  public updateEntity(entityName: EntityName, update: Update) {
    const oldEntity = this.state[entityName][update.id];

    this.state[entityName][update.id] = {
      ...oldEntity,
      ...update.changes,
    };
  }

  public addEntity(entityName: EntityName, entity: any) {
    this.state[entityName][entity.id] = entity;
  }

  public normalize(data: any, schema: Schema) {
    const { result, entities } = normalize(data, schema);

    for (const entityName of Object.keys(entities)) {
      for (const entity of entities[entityName]) {
        this.addEntity(entityName, entity);
      }
    }

    return result;
  }

  public denormalize(normalizedData: any, schema: Schema) {
    const denormalized = denormalize(normalizedData, schema, this.state);

    return denormalized;
  }
}

export const entityManager = new EntityManager();
