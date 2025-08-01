import "@mantine/core/styles.css";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import RecordVideo from "./RecordVideo.tsx";
import { websocketClient } from "@/websocket";
import Subscribe from "./Subscribe.tsx";
import {
  useStartSession,
  startMutation,
  StartSessionError,
  useNewMediaFrameSub,
  useGetUsersQuery,
} from "@/entity";

const App = () => {
  const [show, setShow] = useState(false);
  const [isSub, setIsSub] = useState(false);
  const [connected, setConnected] = useState(false);
  const [count, setCount] = useState(0);

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
    // const incomingMessage = await websocketClient.sendMessage({
    //   meta: {
    //     messageId: String(Date.now()),
    //   },
    //   type: "GET_USERS",
    //   payload: {
    //     limit: 10,
    //     search: "Hello",
    //   },
    // });
    // console.log(incomingMessage);
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
          // if (e.errorIs("VALIDATION")) {
          //   console.log(e.details.foo);
          // }
        },
      });
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
      <Button
        type="button"
        onClick={() => {
          test();
        }}
      >
        Test
      </Button>
      <Button
        type="button"
        onClick={() => {
          setShow(true);
        }}
      >
        Show
      </Button>
      {show && <Subscribe />}
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
