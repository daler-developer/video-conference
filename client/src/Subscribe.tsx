import { useNewMediaFrameSub } from "./websocket";

const Subscribe = () => {
  useNewMediaFrameSub({
    eventParams: {
      conferenceId: "test1",
    },
    onData({ message }) {
      console.log("onData", message.payload.eventData.data);
    },
  });

  return (
    <div>
      <div>Hello World</div>
    </div>
  );
};

export default Subscribe;
