import mitt from "mitt";
import type { EntityId } from "@/entity/query-cache/entity-manager/createEntity.ts";

type Events = {
  ENTITY_UPDATED: {
    entityType: string;
    entityId: EntityId;
  };
};

export type QueryCacheEventBusCallback<K extends keyof Events> = (
  payload: Events[K],
) => void;

export const queryCacheEventBus = mitt<Events>();

queryCacheEventBus.on("ENTITY_UPDATED", (arg) => {
  // console.log("ENTITY_UPDATED", arg);
});
