import { useNewMediaFrameSub } from "@/entity";

const Subscribe = () => {
  useNewMediaFrameSub({
    params: {
      conferenceId: "hello_world",
    },
    onData({ data }) {
      console.log("event", data.data);
    },
  });

  return (
    <div>
      <div>Hello World</div>
    </div>
  );
};

export default Subscribe;
