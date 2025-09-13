import {
  type BaseIncomingMessage,
  createOutgoingMessageCreator,
  websocketClient,
} from "@/websocket";
import _ from "lodash";
import { type EventSubCallback } from "../utils/createEventSub";

type Options<TEventName extends string = string> = {
  eventName: TEventName;
};

const EVENT_SUB = "EVENT_SUB";
const EVENT_UNSUB = "EVENT_UNSUB";
const EVENT_SUB_DATA = "EVENT_SUB_DATA";

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

export const createWebsocketEventSubCallback = <TEventName extends string>({
  eventName,
}: Options<TEventName>): EventSubCallback<any, any> => {
  return ({ params, onData }) => {
    const createEventSubMessage = createOutgoingMessageCreator({
      type: EVENT_SUB,
    });

    websocketClient.sendMessage(
      createEventSubMessage({
        payload: {
          eventName,
          eventParams: params,
        },
      }),
    );

    const off = websocketClient.onMessage((message) => {
      if (incomingMessageIsOfTypeEventSubData(message)) {
        if (message.payload.eventName === eventName) {
          if (_.isEqual(message.payload.eventParams, params)) {
            onData({
              data: message.payload.eventData,
            });
          }
        }
      }
    });

    return {
      unsubscribe() {
        const createEventUnsubMessage = createOutgoingMessageCreator({
          type: EVENT_UNSUB,
        });

        off();
        websocketClient.sendMessage(
          createEventUnsubMessage({
            payload: {
              eventName,
              eventParams: params,
            },
          }),
        );
      },
    };
  };
};
