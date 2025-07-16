import "@mantine/core/styles.css";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import RecordVideo from "./RecordVideo.tsx";
import { connect as websocketConnect } from "./websocket";
import Subscribe from "./Subscribe.tsx";
import { sendStartSessionMessage, useStartSession } from "@/entity";

const App = () => {
  const [isSub, setIsSub] = useState(false);
  const [connected, setConnected] = useState(false);

  const mutations = {
    startSession: useStartSession(),
  };

  useEffect(() => {
    const connect = async () => {
      await websocketConnect();
      setConnected(true);
    };

    connect();
  }, []);

  const test = async () => {
    try {
      const { data } = await mutations.startSession.mutate({
        payload: {},
      });

      console.log("data", data);

      // const { response } = await sendStartSessionMessage({
      //   payload: {
      //     fullName: "Saidov Daler",
      //   },
      // });
      //
      // console.log(response);
    } catch (e) {
      console.dir(e);
    }
  };

  if (!connected) {
    return null;
  }

  return (
    <div style={{ margin: "50px" }}>
      <h1>React App</h1>
      <Button type="button" onClick={test}>
        Test
      </Button>
      {isSub && <Subscribe />}
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
      <RecordVideo />
    </div>
  );
};

export default App;
