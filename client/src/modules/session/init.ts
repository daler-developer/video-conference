import { websocketClient } from "@/websocket";
import { sessionManager } from "./SessionManager";

const init = async () => {
  await websocketClient.connect(sessionManager.getAccessToken());
};

export { init };
