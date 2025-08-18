import { Entity } from "./Entity.ts";
import { Subscribable } from "../Subscribable.ts";
import { type EntityName } from "../entity-manager/EntityManager.ts";

type BaseEntity = {
  id: number;
};

type Update<TEntity extends BaseEntity> = {
  id: number;
  changes: Omit<Partial<TEntity>, "id">;
};

type RepositoryNotifyEvent = {
  type: "entity-updated";
};

type Listener = (event: RepositoryNotifyEvent) => void;

export abstract class Repository<
  TEntity extends Entity,
> extends Subscribable<Listener> {
  #byId: Map<number, TEntity> = new Map();
  #allIds = new Set<number>();

  getOne(id: number): TEntity | null {
    return this.#byId.get(id) || null;
  }

  getAllById() {
    return this.#byId;
  }

  addOne(data: TEntity): void {
    const exists = this.#allIds.has(data.getData().id);

    if (!exists) {
      this.#byId.set(data.getData().id, data);
      this.#allIds.add(data.getData().id);
    }
  }

  addMany(entities: TEntity[]) {
    for (const entity of entities) {
      this.addOne(entity);
    }
  }

  setOne(data: TEntity): void {
    this.#byId.set(data.getData().id, data);
    this.#allIds.add(data.getData().id);
  }

  setMany(entities: TEntity[]): void {
    for (const entity of entities) {
      this.setOne(entity);
    }
  }

  removeOne(id: number): void {
    this.#byId.delete(id);
    this.#allIds.delete(id);
  }

  removeMany(ids: number[]) {
    for (const id of ids) {
      this.removeOne(id);
    }
  }

  // updateOne({ id, changes }: Update<TEntity>): void {
  //   const entity = this.#byId[id];
  //
  //   if (entity) {
  //     this.#byId[id] = {
  //       ...entity,
  //       ...changes,
  //     };
  //   }
  // }

  // updateMany(updates: Update<TEntity>[]) {
  //   for (const update of updates) {
  //     this.updateOne(update);
  //   }
  // }

  // upsertOne(entity: Entity): void {
  //   const existingEntity = this.#byId[entity.id];
  //
  //   if (existingEntity) {
  //     this.#byId[entity.id] = {
  //       ...existingEntity,
  //       ...entity,
  //     };
  //   } else {
  //     this.addOne(entity);
  //   }
  // }
  //
  // upsertMany(entities: TEntity[]): void {
  //   for (const entity of entities) {
  //     this.upsertOne(entity);
  //   }
  // }
}
