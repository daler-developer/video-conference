import "@mantine/core/styles.css";
import "./main.css";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
