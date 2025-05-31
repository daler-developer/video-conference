import "@mantine/core/styles.css";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import Subscribe from "./Subscribe.tsx";
import ws from "./ws";

const App = () => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ margin: "50px" }}>
      <h1>React App</h1>
      <div>
        <Button
          onClick={() => {
            setShow((prev) => !prev);
          }}
        >
          Show/Hide
        </Button>
      </div>
      {show && <Subscribe />}
    </div>
  );
};

export default App;
