// import { Subscribable } from "../Subscribable.ts";
import { queryCacheEventBus } from "@/entity/query-cache/eventBus.ts";
import type { EntityId } from "@/entity/query-cache/entity-manager/EntityManager.ts";

export type BaseEntity = {};

type Update<TNormalizedEntity extends BaseEntity> = {
  id: number;
  changes: Omit<Partial<TNormalizedEntity>, "id">;
};

// type RepositoryNotifyEvent = {
//   type: "entity-updated";
// };

// type Listener = (event: RepositoryNotifyEvent) => void;

export const entityTypeSymbol = Symbol("entityType");

export abstract class BaseRepository<TNormalizedEntity extends BaseEntity> {
  #byId: Map<EntityId, TNormalizedEntity> = new Map();
  #allIds = new Set<EntityId>();
  #entityType: string;

  constructor(entityType: string) {
    this.#entityType = entityType;
  }

  abstract getId(normalizedEntity: TNormalizedEntity): EntityId;

  getOne(id: EntityId): TNormalizedEntity | null {
    return this.#byId.get(id) || null;
  }

  getAllById() {
    return this.#byId;
  }

  addOne(normalizedEntity: TNormalizedEntity): void {
    const id = this.getId(normalizedEntity);
    const exists = this.#allIds.has(id);

    if (!exists) {
      this.#byId.set(id, {
        ...normalizedEntity,
        [entityTypeSymbol]: this.#entityType,
      });
      this.#allIds.add(id);
    }
  }

  addMany(normalizedEntities: TNormalizedEntity[]) {
    for (const normalizedEntity of normalizedEntities) {
      this.addOne(normalizedEntity);
    }
  }

  setOne(normalizedEntity: TNormalizedEntity): void {
    const id = this.getId(normalizedEntity);
    this.#byId.set(id, normalizedEntity);
    this.#allIds.add(id);
  }

  setMany(normalizedEntities: TNormalizedEntity[]): void {
    for (const normalizedEntity of normalizedEntities) {
      this.setOne(normalizedEntity);
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

  updateOne({ id, changes }: Update<TNormalizedEntity>): void {
    const normalizedEntity = this.#byId.get(id);

    if (normalizedEntity) {
      this.#byId.set(id, {
        ...normalizedEntity,
        ...changes,
      });

      // this.listeners.forEach((listener) => {
      //   listener({ type: "entity-updated" });
      // });
      queryCacheEventBus.emit("ENTITY_UPDATED", {
        entityId: this.getId(normalizedEntity),
        entityType: this.#entityType,
      });
    }
  }

  updateMany(updates: Update<TNormalizedEntity>[]) {
    for (const update of updates) {
      this.updateOne(update);
    }
  }

  upsertOne(normalizedEntity: TNormalizedEntity): void {
    const id = this.getId(normalizedEntity);
    const existingNormalizedEntity = this.#byId.get(id);

    if (existingNormalizedEntity) {
      this.#byId.set(id, {
        ...existingNormalizedEntity,
        ...normalizedEntity,
      });
      queryCacheEventBus.emit("ENTITY_UPDATED", {
        entityId: id,
        entityType: this.#entityType,
      });
    } else {
      this.addOne(normalizedEntity);
    }
  }

  upsertMany(normalizedEntities: TNormalizedEntity[]): void {
    for (const normalizedEntity of normalizedEntities) {
      this.upsertOne(normalizedEntity);
    }
  }
}
