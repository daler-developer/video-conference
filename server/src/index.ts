import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import redisClient from './redis/client';

const app = express();
const port = process.env.PORT || 3000;

const runApp = async () => {
  const server = http.createServer(app);

  await redisClient
    .on('error', (err) => {
      console.log('redis error');
    })
    .connect();

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

runApp();
