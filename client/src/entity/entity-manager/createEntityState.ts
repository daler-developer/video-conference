export type EntityState = {
  byId: Record<string, any>;
  allIds: string[];
};

export const createEntityState = (): EntityState => {
  return {
    byId: {},
    allIds: [],
  };
};
