import { RouterProvider } from "react-router/dom";
import { MantineProvider } from "@mantine/core";
import { router } from "@/app/router.tsx";
import { useEffect, useState } from "react";
import { websocketClient } from "@/websocket";

const App = () => {
  const [connected, setConnected] = useState(false);

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
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default App;
