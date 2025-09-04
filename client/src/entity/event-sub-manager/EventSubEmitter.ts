import mitt from "mitt";

type Events = {
  NEW_DATA: {
    eventSubHash: string;
    data: unknown;
  };
};

export type EventSubEmitterEventCallback<K extends keyof Events> = (
  payload: Events[K],
) => void;

export const eventSubEmitter = mitt<Events>();

// emitter.on("event", (e) => console.log("Got:", e));
//
// emitter.emit("event", { foo: "bar" });
