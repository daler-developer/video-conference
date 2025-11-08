import { RouterProvider } from "react-router/dom";
import { MantineProvider } from "@mantine/core";
import { router } from "@/app/router.tsx";
import { useEffect, useState } from "react";
import { websocketClient } from "@/websocket";
import { getAccessToken } from "@/modules/session";
import { Conference } from "@/modules/conference";

const App = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connect = async () => {
      await websocketClient.connect(getAccessToken());
      setConnected(true);
    };

    connect();
  }, []);

  if (!connected) {
    return null;
  }

  return (
    <MantineProvider>
      {/*<Conference id={1} />*/}
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default App;
