import mitt from "mitt";

type Events = {
  ENTITY_UPDATED: {
    entityType: string;
    entityId: string;
  };
};

export type QueryCacheEventBusCallback<K extends keyof Events> = (
  payload: Events[K],
) => void;

export const queryCacheEventBus = mitt<Events>();

queryCacheEventBus.on("ENTITY_UPDATED", (arg) => {
  console.log("ENTITY_UPDATED", arg);
});
