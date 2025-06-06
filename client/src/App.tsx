import "@mantine/core/styles.css";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import Subscribe from "./Subscribe.tsx";
import ws from "./ws";

const App = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    ws.onmessage = (m) => {
      console.log(JSON.parse(m.data));
    };

    setTimeout(() => {
      ws.send(
        JSON.stringify({
          type: "EVENT_SUB",
          payload: {
            eventName: "CONFERENCE_NEW_PARTICIPANT_JOINED",
          },
        }),
      );
    }, 1000);
  }, []);

  return (
    <div style={{ margin: "50px" }}>
      <h1>React App</h1>
      <div>
        <Button
          onClick={() => {
            ws.send(
              JSON.stringify({
                type: "JOIN_CONFERENCE",
                payload: {},
              }),
            );
          }}
        >
          Show/Hide
        </Button>
      </div>
      {show && <Subscribe />}
    </div>
  );
};

export default App;
