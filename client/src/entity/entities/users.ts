import createNormalizedEntityStore from "../createNormalizedEntityStore.ts";

export const { entitySchema: UserEntity } = createNormalizedEntityStore({
  nameInPlural: "users",
});
