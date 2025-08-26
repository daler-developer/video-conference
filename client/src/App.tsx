import "@mantine/core/styles.css";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import RecordVideo from "./RecordVideo.tsx";
import { websocketClient } from "@/websocket";
import Subscribe from "./Subscribe.tsx";
import {
  useStartSession,
  StartSessionError,
  useNewMediaFrameSub,
  useGetUsersQuery,
} from "@/entity";
import { useForceRender } from "@/shared/hooks";
import TestButton from "@/TestButton.tsx";

let counter = 3;

const App = () => {
  const [show, setShow] = useState(false);
  const [isSub, setIsSub] = useState(false);
  const [connected, setConnected] = useState(false);
  const [count, setCount] = useState(0);

  const forceRender = useForceRender();

  useEffect(() => {
    const connect = async () => {
      await websocketClient.connect();
      setConnected(true);
    };

    connect();
  }, []);

  if (!connected) {
    return null;
  }

  return (
    <div style={{ margin: "50px" }}>
      <TestButton />
      {/*<Button*/}
      {/*  type="button"*/}
      {/*  onClick={() => {*/}
      {/*    setShow(true);*/}
      {/*  }}*/}
      {/*>*/}
      {/*  Show*/}
      {/*</Button>*/}
      <div>
        <Button
          type="button"
          onClick={() => {
            setIsSub(true);
          }}
        >
          Sub
        </Button>
        <Button
          type="button"
          onClick={() => {
            setIsSub(false);
          }}
        >
          Unsub
        </Button>
      </div>
      {isSub && <Subscribe />}
      {/*<RecordVideo />*/}
    </div>
  );
};

export default App;
