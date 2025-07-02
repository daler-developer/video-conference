import "@mantine/core/styles.css";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import RecordVideo from "./RecordVideo.tsx";
import websocketClient from "./WebsocketClient.ts";
import { v4 as uuidv4 } from "uuid";
import useEventSub from "./websocket/useEventSub.ts";
import Subscribe from "./Subscribe.tsx";
import { sendEventSubMessage } from "./websocket/sendMessage/sendEventSubMessage.ts";
import { sendEventUnsubMessage } from "./websocket/sendMessage/sendEventUnsubMessage.ts";

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
    sendEventSubMessage({
      payload: {
        eventName: "NEW_MEDIA_FRAME",
        eventParams: {
          conferenceId: "test1",
        },
      },
    });
  };

  if (!connected) {
    return null;
  }

  return (
    <div style={{ margin: "50px" }}>
      <h1>React App</h1>
      {/*<Button type="button" onClick={test}>*/}
      {/*  Test*/}
      {/*</Button>*/}
      <Subscribe />
      <div>
        <Button
          type="button"
          onClick={() => {
            sendEventSubMessage({
              payload: {
                eventName: "NEW_MEDIA_FRAME",
                eventParams: {
                  conferenceId: "test1",
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
            sendEventUnsubMessage({
              payload: {
                eventName: "NEW_MEDIA_FRAME",
                eventParams: {
                  conferenceId: "test1",
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
