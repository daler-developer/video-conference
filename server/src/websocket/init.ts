import * as fs from 'fs';
import * as path from 'path';
import WebSocket from 'ws';
import { Server } from 'http';
import { Message, MESSAGE_TYPE } from './types';
import subscriptionManager from './SubscriptionManager';
import createResolverByMessageType from './createResolverByMessageType';
import processMiddleware from './middleware/processMiddleware';
import parseBinaryMessage from './parseBinaryMessage';
import WebSocketWrapper from './WebSocketWrapper';

const initHandlers = async () => {
  const pluginsDir = path.resolve(__dirname, 'resolvers');

  const entries = fs.readdirSync(pluginsDir, { withFileTypes: true });

  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((dir) => dir.name);

  // @ts-ignore
  const result: Record<
    string,
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

  for (let handler of Object.values(handlersByMessageType)) {
    handler.init?.();
  }

  const wss = new WebSocket.Server({ server });

  const allClients = new Set<WebSocketWrapper>();

  wss.on('connection', (ws, request) => {
    const client = new WebSocketWrapper(ws);

    allClients.add(client);

    client.onMessage(async (message) => {
      const ctx: any = {};

      const resolver = handlersByMessageType[message.type];

      const isInvalid = resolver.validator && !resolver.validator({ message });

      if (isInvalid) {
        client.sendMessage({
          type: 'validation error',
        });
        return;
      }

      processMiddleware(resolver.middleware, { ctx, message, request });

      try {
        const response = await resolver.execute({
          ctx,
          message,
          client,
        });

        if (response) {
          client.sendMessage(response);
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
};

export default init;
