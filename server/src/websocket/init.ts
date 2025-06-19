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

  for (let handler of Object.values(handlersByMessageType)) {
    handler.init?.();
  }

  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, request) => {
    const client = new WebSocketWrapper(ws);

    client.onMessage((message) => {
      // console.log(message);
    });

    // ws.on('message', (data: any, isBinary) => {
    // const { message, binary } = parseBinaryMessage({ data, isBinary });
    //
    // const ctx: any = {};
    //
    // const resolver = handlersByMessageType[message.type as MESSAGE_TYPE];
    //
    // const isInvalid =
    //   resolver.validator && !resolver.validator({ msg: message });
    //
    // if (isInvalid) {
    //   ws.send(
    //     JSON.stringify({
    //       type: 'validation error',
    //     })
    //   );
    //   return;
    // }
    //
    // processMiddleware(resolver.middleware, { ctx, message, request });
    //
    // // @ts-ignore
    // resolver.execute({
    //   ctx,
    //   msg: message,
    //   ws,
    //   binary,
    // });
    // });
  });
};

export default init;
