import "@mantine/core/styles.css";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import Subscribe from "./Subscribe.tsx";
import ws from "./ws";
import RecordVideo from "./RecordVideo.tsx";
import websocketClient from "./WebsocketClient.ts";

const App = () => {
  useEffect(() => {
    websocketClient.onMessage((message) => {});
  }, []);

  return (
    <div style={{ margin: "50px" }}>
      <h1>React App</h1>
      <div>
        <Button
          type="button"
          onClick={() => {
            const str = "HelloWorld";
            const encoder = new TextEncoder();
            const encoded = encoder.encode(str);

            const buffer = new ArrayBuffer(encoded.length);
            const view = new Uint8Array(buffer);
            view.set(encoded);

            websocketClient.sendMessage({
              type: "EVENT_SUB",
              payload: {
                eventName: "new sub",
                temp: buffer,
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
                eventName: "CONFERENCE_NEW_PARTICIPANT_JOINED",
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
      <input
        type="file"
        onChange={(e) => {
          const file = Array.from(e.currentTarget.files || [])[0];
          // const url = URL.createObjectURL(file);
          // console.log(url);
          ws.send(file);
        }}
      />
      <RecordVideo />
    </div>
  );
};

export default App;
