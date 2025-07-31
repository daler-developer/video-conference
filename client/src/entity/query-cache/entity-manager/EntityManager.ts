import { denormalize, normalize, type Schema } from "normalizr";
import { UserRepository, type NormalizedUserEntity } from "./UserRepository.ts";
import {
  MessageRepository,
  type NormalizedMessageEntity,
} from "./MessageRepository.ts";

type EntityName =
  | typeof UserRepository.entityName
  | typeof MessageRepository.entityName;

type Entities = {
  users: Record<number, NormalizedUserEntity>;
  messages: Record<number, NormalizedMessageEntity>;
};

export class EntityManager {
  #repositories = {
    [UserRepository.entityName]: new UserRepository(),
    [MessageRepository.entityName]: new MessageRepository(),
  };

  private getAllEntities() {
    const res: Entities = {} as any;
    for (const entityName of Object.keys(this.#repositories) as EntityName[]) {
      res[entityName] = this.getRepository(entityName).getAllById();
    }
    return res;
  }

  getRepository(repositoryName: EntityName) {
    return this.#repositories[repositoryName];
  }

  processData<TResult, TData, TSchema extends Schema>(
    data: TData,
    schema: TSchema,
  ) {
    const { result, entities } = normalize<any, Entities, TResult>(
      data,
      schema,
    );

    for (const entityName of Object.keys(entities) as EntityName[]) {
      const allEntities = Object.values(entities[entityName]);
      for (const entity of allEntities) {
        this.getRepository(entityName).addOne(entity);
      }
    }

    return result as any;
  }

  denormalizeData<TResult>(normalizedData: unknown, schema: Schema) {
    return denormalize(
      normalizedData,
      schema,
      this.getAllEntities(),
    ) as TResult;
  }
}
