// import { createEntity } from "../createEntity.ts";
// import { schema } from "normalizr";
//
// export type UserEntity = {
//   id: number;
//   name: string;
//   age: number;
// };
//
// export type NormalizedUserEntity = UserEntity;
//
// export const USER_ENTITY_TYPE = "user";
//
// export const UserEntitySchema = new schema.Entity(USER_ENTITY_TYPE);
//
// export const userEntity = createEntity<
//   "user",
//   UserEntity,
//   NormalizedUserEntity
// >({
//   type: USER_ENTITY_TYPE,
//   schema: UserEntitySchema,
//   identify(normalizedEntity) {
//     return normalizedEntity.id;
//   },
// });
