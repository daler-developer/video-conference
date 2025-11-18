import { RouterProvider } from "react-router/dom";
import { router } from "@/app/router.tsx";
import { useEffect, useState } from "react";
import { init as initSessionModule } from "@/modules/session";
import FullscreenLoading from "./FullscreenLoading.tsx";

const App = () => {
  const [inited, setInited] = useState(false);

  useEffect(() => {
    const initAll = async () => {
      await initSessionModule();

      setInited(true);
    };

    initAll();
  }, []);

  if (!inited) {
    return <FullscreenLoading />;
  }

  return <RouterProvider router={router} />;
};

export default App;
