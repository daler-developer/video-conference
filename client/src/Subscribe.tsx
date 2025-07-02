import { useEffect } from "react";
import { listenNewMediaFrameMessage } from "./websocket/listenMessage/listenNewMediaFrameMessage.ts";

const Subscribe = () => {
  useEffect(() => {
    listenNewMediaFrameMessage({
      eventParams: {
        conferenceId: "test1",
      },
      callback({ message }) {
        console.log(message);
      },
    });
  }, []);

  return (
    <div>
      <div>Hello World</div>
    </div>
  );
};

export default Subscribe;
