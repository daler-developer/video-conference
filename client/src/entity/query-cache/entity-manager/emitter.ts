import mitt from "mitt";

type Events = {};

export type EventSubEmitterEventCallback<K extends keyof Events> = (
  payload: Events[K],
) => void;

export const entityEmitter = mitt<Events>();
