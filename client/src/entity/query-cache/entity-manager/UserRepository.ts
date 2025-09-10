// import { schema } from "normalizr";
// import { Repository } from "./Repository";
//
// export type UserEntity = {
//   id: number;
//   name: string;
//   age: number;
// };
//
// export type NormalizedUserEntity = UserEntity;
//
// const ENTITY_NAME = "user";
//
// export const UserEntitySchema = new schema.Entity(ENTITY_NAME);
//
// export class UserRepository extends Repository<NormalizedUserEntity> {
//   static entityName = ENTITY_NAME;
//
//   constructor() {
//     super(ENTITY_NAME);
//   }
//
//   getId(entity: NormalizedUserEntity) {
//     return entity.id;
//   }
// }
