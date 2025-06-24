import useEventSub from "./useEventSub.ts";

const Subscribe = () => {
  useEventSub({
    eventName: "NEW_MEDIA_FRAME",
    onData(message) {
      console.log(message);
    },
  });

  return (
    <div>
      <div>Hello World</div>
    </div>
  );
};

export default Subscribe;
