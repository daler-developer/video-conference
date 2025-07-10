import { create } from "zustand";
import { schema } from "normalizr";
import { devtools } from "zustand/middleware";

type Options = {
  nameInPlural: string;
};

type StoreValues<TEntity extends { id: string }> = {
  byId: { [key: string]: TEntity };
  allIds: Array<TEntity["id"]>;
};

const createNormalizedEntityStore = <TEntity extends { id: string }>({
  nameInPlural,
}: Options) => {
  const entitySchema = new schema.Entity(nameInPlural);

  const useStore = create<StoreValues<TEntity>>()(
    devtools(
      () => ({
        byId: {},
        allIds: [],
      }),
      {
        name: nameInPlural,
      },
    ),
  );

  const actions = {
    mergeMany(entities: { [key: string]: TEntity }) {
      useStore.setState((state) => ({
        byId: {
          ...state.byId,
          ...entities,
        },
      }));
    },
  };

  return {
    useStore,
    actions,
    entitySchema,
  };
};

export default createNormalizedEntityStore;
