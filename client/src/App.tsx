import "@mantine/core/styles.css";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import RecordVideo from "./RecordVideo.tsx";
import websocketClient from "./WebsocketClient.ts";
import { v4 as uuidv4 } from "uuid";
import useEventSub from "./useEventSub.ts";
import Subscribe from "./Subscribe.tsx";

const App = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connect = async () => {
      await websocketClient.connect();
      setConnected(true);
    };

    connect();
  }, []);

  const test = async () => {
    const response = await websocketClient.sendMessage({
      id: uuidv4(),
      type: "JOIN_CONFERENCE",
      payload: {
        foo: "bar",
      },
    });
  };

  if (!connected) {
    return null;
  }

  return (
    <div style={{ margin: "50px" }}>
      <h1>React App</h1>
      <Subscribe />
      <div>
        <Button
          type="button"
          onClick={() => {
            websocketClient.sendMessage({
              type: "EVENT_SUB",
              payload: {
                eventName: "NEW_MEDIA_FRAME",
                eventParams: {
                  conferenceId: "test",
                },
              },
            });
          }}
        >
          Sub
        </Button>
        <Button
          type="button"
          onClick={() => {
            websocketClient.sendMessage({
              type: "EVENT_UNSUB",
              payload: {
                eventName: "NEW_MEDIA_FRAME",
                eventParams: {
                  conferenceId: "test",
                },
              },
            });
          }}
        >
          Unsub
        </Button>
      </div>
      <RecordVideo />
    </div>
  );
};

export default App;
