export type EntityState = {
  byIds: Record<string, any>;
  allIds: string[];
};

export const createEntityState = (): EntityState => {
  return {
    byId: {},
    allIds: [],
  };
};
