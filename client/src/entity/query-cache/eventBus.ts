import mitt from "mitt";

type Events = {
  ENTITY_UPDATED: void;
};

export type QueryCacheEventBusCallback<K extends keyof Events> = (
  payload: Events[K],
) => void;

export const queryCacheEventBus = mitt<Events>();

// queryCacheEventBus.on("ENTITY_UPDATED", () => {
//   console.log("test");
// });
