import { useEffect } from "react";
import ws from "./ws.ts";

const Subscribe = () => {
  useEffect(() => {
    // ws.send(
    //   JSON.stringify({
    //     type: "EVENT_SUB",
    //   }),
    // );
    // ws.send(new Blob([]));
  }, []);

  return (
    <div>
      <div>Hello World</div>
    </div>
  );
};

export default Subscribe;
