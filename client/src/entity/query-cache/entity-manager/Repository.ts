// import { Subscribable } from "../Subscribable.ts";
import { queryCacheEventBus } from "@/entity/query-cache/eventBus.ts";

export type BaseEntity = {
  id: number;
};

type Update<TEntity extends BaseEntity> = {
  id: number;
  changes: Omit<Partial<TEntity>, "id">;
};

// type RepositoryNotifyEvent = {
//   type: "entity-updated";
// };

// type Listener = (event: RepositoryNotifyEvent) => void;

export abstract class Repository<TEntity extends BaseEntity> {
  #byId: Map<number, TEntity> = new Map();
  #allIds = new Set<number>();

  getOne(id: number): TEntity | null {
    return this.#byId.get(id) || null;
  }

  getAllById() {
    return this.#byId;
  }

  addOne(data: TEntity): void {
    const exists = this.#allIds.has(data.id);

    if (!exists) {
      this.#byId.set(data.id, data);
      this.#allIds.add(data.id);
    }
  }

  addMany(entities: TEntity[]) {
    for (const entity of entities) {
      this.addOne(entity);
    }
  }

  setOne(data: TEntity): void {
    this.#byId.set(data.id, data);
    this.#allIds.add(data.id);
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

  updateOne({ id, changes }: Update<TEntity>): void {
    const entity = this.#byId.get(id);

    if (entity) {
      this.#byId.set(id, {
        ...entity,
        ...changes,
      });

      // this.listeners.forEach((listener) => {
      //   listener({ type: "entity-updated" });
      // });
      queryCacheEventBus.emit("ENTITY_UPDATED");
    }
  }

  updateMany(updates: Update<TEntity>[]) {
    for (const update of updates) {
      this.updateOne(update);
    }
  }

  upsertOne(entity: TEntity): void {
    const existingEntity = this.#byId.get(entity.id);

    if (existingEntity) {
      this.#byId.set(entity.id, {
        ...existingEntity,
        ...entity,
      });
      queryCacheEventBus.emit("ENTITY_UPDATED");
    } else {
      this.addOne(entity);
    }
  }

  upsertMany(entities: TEntity[]): void {
    for (const entity of entities) {
      this.upsertOne(entity);
    }
  }
}
