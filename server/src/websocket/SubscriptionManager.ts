import WebSocket from 'ws';
import { EVENT_NAME } from './types';

type MapValue = Set<{
  params: any;
  ctx: any;
}>;

class SubscriptionManager {
  private eventSubscribersMap = new Map<
    EVENT_NAME,
    Array<{
      ws: WebSocket;
      params: any;
      ctx: any;
    }>
  >();
  private websocketDataMap = new Map<
    WebSocket,
    {
      params: any;
      ctx: any;
    }
  >();

  subscribe(
    eventName: EVENT_NAME,
    { ws, params, ctx }: { ws: WebSocket; params: any; ctx: any }
  ) {
    if (!this.eventSubscribersMap.has(eventName)) {
      this.eventSubscribersMap.set(eventName, []);
    }
    this.eventSubscribersMap.get(eventName)!.push({
      ws,
      params,
      ctx,
    });
    // this.websocketDataMap.set(ws, {
    //   params,
    //   ctx,
    // });
  }

  unsubscribe(eventName: EVENT_NAME, ws: WebSocket) {
    if (!this.eventSubscribersMap.has(eventName)) {
      return;
    }
    this.eventSubscribersMap.set(
      eventName,
      this.eventSubscribersMap.get(eventName)!.filter((sub) => sub.ws !== ws)
    );
    // this.websocketDataMap.delete(ws);
  }

  getSubscribers(eventName: EVENT_NAME) {
    return this.eventSubscribersMap.get(eventName) || [];
  }

  unsubscribeFromAllEvents(ws: WebSocket) {
    for (const eventName of this.eventSubscribersMap.keys()) {
      this.unsubscribe(eventName, ws);
    }
  }
}

export default new SubscriptionManager();
