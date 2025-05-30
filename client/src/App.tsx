import "@mantine/core/styles.css";
import { Button } from "@mantine/core";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>React App</h1>
    </div>
  );
};

export default App;
