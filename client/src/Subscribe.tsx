import { useNewMediaFrameSub } from "@/entity";

const Subscribe = () => {
  useNewMediaFrameSub({
    params: {
      conferenceId: "hello",
    },
    onData({ data }) {
      // console.log(data.data);
    },
  });

  return (
    <div>
      <div>Hello World</div>
    </div>
  );
};

export default Subscribe;
