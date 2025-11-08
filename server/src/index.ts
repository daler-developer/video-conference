import 'reflect-metadata';
import './iocContainer';
import express from 'express';
import http from 'http';
import initWebsocket from './websocket/init';
import redisClient from './redis/client';
import { PrismaClient } from './generated/prisma';

const app = express();
const port = process.env.PORT || 3000;

const runApp = async () => {
  const server = http.createServer(app);

  await redisClient
    .on('error', (err) => {
      console.log('redis error');
    })
    .connect();

  await initWebsocket(server);

  server.listen(port as number, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

runApp();
