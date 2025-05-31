import { useEffect } from "react";
import ws from "./ws.ts";

const Subscribe = () => {
  useEffect(() => {
    ws.send(
      JSON.stringify({
        type: "START_SESSION",
        params: {
          fullName: "Saidov Daler",
        },
      }),
    );
    // ws.send(new Blob([]));
  }, []);

  return (
    <div>
      <div>Hello World</div>
    </div>
  );
};

export default Subscribe;
