import { denormalize, normalize, type Schema } from "normalizr";
import { Repository } from "./Repository.ts";
import { UserRepository } from "./UserRepository.ts";
import { MessageRepository } from "./MessageRepository.ts";

type RepositoryName = "users" | "messages";

export class EntityManager {
  #repositories: Record<RepositoryName, Repository<any>> = {
    users: new UserRepository(),
    messages: new MessageRepository(),
  };

  private getAllEntities() {
    const res = {};
    for (const repositoryName of Object.keys(this.#repositories)) {
      res[repositoryName] = this.getRepository(repositoryName).getAllById();
    }
    return res;
  }

  getRepository(repositoryName: RepositoryName) {
    return this.#repositories[repositoryName];
  }

  processData<TData>(data: TData, schema: Schema) {
    const { result, entities } = normalize(data, schema);

    for (const entityName of Object.keys(entities) as RepositoryName[]) {
      const allEntities = Object.values(entities[entityName]);
      for (const entity of allEntities) {
        this.getRepository(entityName).addOne(entity);
      }
    }

    return result;
  }

  denormalizeData<TData>(data: TData, schema: Schema) {
    const denormalized = denormalize(data, schema, this.getAllEntities());

    return denormalized;
  }
}
