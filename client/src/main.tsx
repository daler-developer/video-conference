import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import "./main.css";
import { createRoot } from "react-dom/client";
import { App } from "@/app";

createRoot(document.getElementById("root")!).render(
  <MantineProvider>
    <App />
  </MantineProvider>,
);
