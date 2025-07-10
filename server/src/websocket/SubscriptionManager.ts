import _ from 'lodash';
import { EVENT_NAME } from './types';
import WebSocketWrapper from './WebSocketWrapper';

class SubscriptionManager {
  private eventSubscribersMap = new Map<
    string,
    Array<{
      client: WebSocketWrapper;
      params: any;
      ctx: any;
    }>
  >();
  private websocketDataMap = new Map<
    WebSocketWrapper,
    {
      params: any;
      ctx: any;
    }
  >();

  subscribe(eventName: string, { client, params, ctx }: { client: WebSocketWrapper; params: any; ctx: any }) {
    if (!this.eventSubscribersMap.has(eventName)) {
      this.eventSubscribersMap.set(eventName, []);
    }

    const subscribed = this.eventSubscribersMap.get(eventName)!.find((sub) => {
      return sub.client === client && _.isEqual(sub.params, params);
    });

    if (subscribed) {
      return;
    }

    this.eventSubscribersMap.get(eventName)!.push({
      client,
      params,
      ctx,
    });
    // this.websocketDataMap.set(ws, {
    //   params,
    //   ctx,
    // });
  }

  unsubscribe(eventName: string, { client, params }: { client: WebSocketWrapper; params: Record<'string', unknown> }) {
    if (!this.eventSubscribersMap.has(eventName)) {
      return;
    }

    this.eventSubscribersMap.set(
      eventName,
      this.eventSubscribersMap.get(eventName)!.filter((sub) => {
        if (sub.client === client && _.isEqual(sub.params, params)) {
          return false;
        }
        return true;
      })
    );
  }

  getSubscribers(eventName: string) {
    return this.eventSubscribersMap.get(eventName) || [];
  }

  // unsubscribeFromAllEvents(ws: WebSocket) {
  //   for (const eventName of this.eventSubscribersMap.keys()) {
  //     this.unsubscribe(eventName, ws);
  //   }
  // }
}

export default new SubscriptionManager();
