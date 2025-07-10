import * as fs from 'fs';
import * as path from 'path';
import WebSocket, { WebSocketServer } from 'ws';
import { Server } from 'http';

const initHandlers = async () => {
  const pluginsDir = path.resolve(__dirname, 'resolvers');

  const entries = fs.readdirSync(pluginsDir, { withFileTypes: true });

  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((dir) => dir.name);

  for (const dir of directories) {
    const indexPath = path.join(pluginsDir, dir, 'index.ts');

    if (fs.existsSync(indexPath)) {
      const modulePath = path.resolve(pluginsDir, dir, 'index.ts');
      await import(modulePath);
    } else {
      console.warn(`No index.ts found in ${dir}`);
    }
  }
};

export let wss: WebSocketServer = null!;

const init = async (server: Server) => {
  wss = new WebSocket.Server({ server });

  initHandlers();
};

export default init;
