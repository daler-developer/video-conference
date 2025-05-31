import * as fs from 'fs';
import * as path from 'path';
import WebSocket from 'ws';
import { Server } from 'http';
import { Message, MESSAGE_TYPE } from './types';
import subscriptionManager from './SubscriptionManager';
import createResolverByMessageType from './createResolverByMessageType';
import processMiddleware from './middleware/processMiddleware';

const initHandlers = async () => {
  const pluginsDir = path.resolve(__dirname, 'resolvers');

  const entries = fs.readdirSync(pluginsDir, { withFileTypes: true });

  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((dir) => dir.name);

  // @ts-ignore
  const result: Record<
    MESSAGE_TYPE,
    ReturnType<typeof createResolverByMessageType>
  > = {};

  for (const dir of directories) {
    const indexPath = path.join(pluginsDir, dir, 'index.ts');

    if (fs.existsSync(indexPath)) {
      const modulePath = path.resolve(pluginsDir, dir, 'index.ts');
      const imported = await import(modulePath);

      // @ts-ignore
      result[dir] = imported.default;
    } else {
      console.warn(`No index.ts found in ${dir}`);
    }
  }
  return result;
};

const init = async (server: Server) => {
  const handlersByMessageType = await initHandlers();

  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, request) => {
    ws.on('message', (data: Message) => {
      // @ts-ignore
      data = JSON.parse(data);

      const ctx: any = {};

      const resolver = handlersByMessageType[data.type];

      processMiddleware(resolver.middleware, { ctx, message: data, request });

      handlersByMessageType[data.type].execute({ ctx, msg: data, ws });
    });

    ws.on('close', () => {
      subscriptionManager.unsubscribeFromAllEvents(ws);
    });
  });
};

export default init;
