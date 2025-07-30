type BaseEntity = {
  id: number;
};

type Update<TEntity extends BaseEntity> = {
  id: number;
  changes: Omit<Partial<TEntity>, "id">;
};

export abstract class Repository<TEntity extends BaseEntity> {
  #byId: Record<number, TEntity> = {};
  #allIds = new Set<number>();

  getOne(id: number): TEntity | null {
    return this.#byId[id];
  }

  getAllById() {
    return this.#byId;
  }

  addOne(data: TEntity): void {
    const exists = this.#allIds.has(data.id);

    if (!exists) {
      this.#byId[data.id] = data;
      this.#allIds.add(data.id);
    }
  }

  addMany(entities: TEntity[]) {
    for (const entity of entities) {
      this.addOne(entity);
    }
  }

  setOne(data: TEntity): void {
    this.#byId[data.id] = data;
    this.#allIds.add(data.id);
  }

  setMany(entities: TEntity[]): void {
    for (const entity of entities) {
      this.setOne(entity);
    }
  }

  removeOne(id: number): void {
    delete this.#byId[id];
    this.#allIds.delete(id);
  }

  removeMany(ids: number[]) {
    for (const id of ids) {
      this.removeOne(id);
    }
  }

  updateOne({ id, changes }: Update<TEntity>): void {
    const entity = this.#byId[id];

    if (entity) {
      this.#byId[id] = {
        ...entity,
        ...changes,
      };
    }
  }

  updateMany(updates: Update<TEntity>[]) {
    for (const update of updates) {
      this.updateOne(update);
    }
  }

  upsertOne(entity: TEntity): void {
    const existingEntity = this.#byId[entity.id];

    if (existingEntity) {
      this.#byId[entity.id] = {
        ...existingEntity,
        ...entity,
      };
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
