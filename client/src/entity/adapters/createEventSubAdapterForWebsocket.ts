import {
  type BaseIncomingMessage,
  type BaseOutgoingMessage,
  websocketClient,
} from "@/websocket";
import { type EventSubAdapter } from "../utils/createEventSub";

type Options<TEventName extends string = string> = {
  eventName: TEventName;
};

const EVENT_SUB = "EVENT_SUB";
const EVENT_SUB_DATA = "EVENT_SUB_DATA";

export type BaseEventSubOutgoingMessage<
  TEventName extends string = string,
  TEventParams extends Record<string, any> = Record<string, any>,
> = BaseOutgoingMessage<
  typeof EVENT_SUB,
  {
    eventName: TEventName;
    eventParams: TEventParams;
  }
>;

export type BaseEventSubDataIncomingMessage<
  TEventName extends string = string,
  TEventParams extends Record<string, any> = Record<string, any>,
  TEventData extends Record<string, any> = Record<string, any>,
> = BaseIncomingMessage<
  typeof EVENT_SUB_DATA,
  {
    eventName: TEventName;
    eventParams: TEventParams;
    eventData: TEventData;
  }
>;

const incomingMessageIsOfTypeEventSubData = (
  message: BaseIncomingMessage,
): message is BaseEventSubDataIncomingMessage => {
  return message.type === EVENT_SUB_DATA;
};

export const createEventSubAdapterForWebsocket = <
  TEventName extends string = string,
  TEventParams extends Record<string, any> = Record<string, any>,
  TEventData extends Record<string, any> = Record<string, any>,
>({
  eventName,
}: Options<TEventName>): EventSubAdapter<TEventParams, TEventData> => {
  return {
    subscribe({ params, onData }) {
      // const out: BaseEventSubOutgoingMessage<TEventName, TEventParams> ={
      //
      // }

      websocketClient.sendMessage({
        type: EVENT_SUB,
        payload: {
          eventName,
          eventParams: params,
        },
      });

      websocketClient.onMessage((message) => {
        if (incomingMessageIsOfTypeEventSubData(message)) {
          if (message.payload.eventName === eventName) {
            onData({
              data: message.payload.eventData as any,
            });
          }
        }
      });

      return {
        unsubscribe() {
          websocketClient.sendMessage({
            type: "EVENT_UNSUB",
            payload: {
              eventName,
              eventParams: params,
            },
          });
        },
      };
    },
  };
};
