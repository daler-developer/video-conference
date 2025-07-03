import { useEffect } from "react";
import { useNewMediaFrameSub } from "./websocket/listenMessage/newMediaFrameSub.ts";

const Subscribe = () => {
  useNewMediaFrameSub({
    eventParams: {
      conferenceId: "test1",
    },
    onData({ message }) {
      console.log("onData", message);
    },
  });

  return (
    <div>
      <div>Hello World</div>
    </div>
  );
};

export default Subscribe;
