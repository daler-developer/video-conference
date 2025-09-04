import mitt from "mitt";

type Events = {
  NEW_DATA: {
    eventSubHash: string;
    data: unknown;
  };
};

export const eventSubEmitter = mitt<Events>();

// emitter.on("event", (e) => console.log("Got:", e));
//
// emitter.emit("event", { foo: "bar" });
