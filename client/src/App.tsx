import "@mantine/core/styles.css";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import Subscribe from "./Subscribe.tsx";
import ws from "./ws";
import RecordVideo from "./RecordVideo.tsx";

const App = () => {
  useEffect(() => {
    ws.onmessage = (m) => {
      const blob = new Blob([m.data], { type: "video/webm;codecs=vp9,opus" });
      const url = URL.createObjectURL(blob);
      console.log(url);
      // setUrl(url);
      // const newBlob = new Blob([m.data], { type: "image/jpg" });
      // const url = URL.createObjectURL(newBlob);
      // setUrl(url);
    };

    setTimeout(() => {
      // ws.send(
      //   JSON.stringify({
      //     type: "EVENT_SUB",
      //     payload: {
      //       eventName: "CONFERENCE_NEW_PARTICIPANT_JOINED",
      //     },
      //   }),
      // );
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
          Send
        </Button>
        <Button
          type="button"
          onClick={() => {
            ws.send(
              JSON.stringify({
                type: "EVENT_SUB",
                payload: {
                  eventName: "NEW_MEDIA_FRAME",
                  eventParams: {
                    conferenceId: "test",
                  },
                },
              }),
            );
          }}
        >
          Sub
        </Button>
        <Button
          type="button"
          onClick={() => {
            ws.send(
              JSON.stringify({
                type: "EVENT_UNSUB",
                payload: {
                  eventName: "CONFERENCE_NEW_PARTICIPANT_JOINED",
                  eventParams: {
                    conferenceId: "test",
                  },
                },
              }),
            );
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
