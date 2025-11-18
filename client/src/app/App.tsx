import { RouterProvider } from "react-router/dom";
import { MantineProvider } from "@mantine/core";
import { router } from "@/app/router.tsx";
import { useEffect, useState } from "react";
import { websocketClient } from "@/modules/websocket";
import { init as initSessionModule } from "@/modules/session";
import { Conference } from "@/modules/conference";

const App = () => {
  const [initted, setInitted] = useState(false);

  useEffect(() => {
    const initAll = async () => {
      await initSessionModule();

      setInitted(true);
    };

    initAll();
  }, []);

  if (!initted) {
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
