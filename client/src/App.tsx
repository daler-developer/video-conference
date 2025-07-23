import "@mantine/core/styles.css";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import RecordVideo from "./RecordVideo.tsx";
import { websocketClient } from "@/websocket";
import Subscribe from "./Subscribe.tsx";
import { useStartSession, startMutation, StartSessionError } from "@/entity";

const App = () => {
  const [isSub, setIsSub] = useState(false);
  const [connected, setConnected] = useState(false);

  const mutations = {
    startSession: useStartSession(),
  };

  useEffect(() => {
    const connect = async () => {
      await websocketClient.connect();
      setConnected(true);
    };

    connect();
  }, []);

  const test = async () => {
    // startMutation({
    //   payload: {
    //     fullName: "Saidov Daler",
    //   },
    // }).then(({ data, error }) => {
    //   if (data) {
    //     console.log(data.accessToken);
    //   }
    //   if (error) {
    //     if (error.errorIs("SECOND")) {
    //       console.log(error.details.age);
    //     }
    //   }
    // });
    try {
      const { data } = await mutations.startSession.mutate({
        payload: {
          fullName: "test",
        },
        handleError(e) {
          console.log(e);
          // if (e.errorIs("VALIDATION")) {
          //   console.log(e.details.foo);
          // }
        },
      });

      console.log("data", data);
    } catch (e) {
      if (e instanceof StartSessionError) {
        const startSessionError = e as InstanceType<typeof StartSessionError>;

        if (startSessionError.errorIs("VALIDATION")) {
        }
      }
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
