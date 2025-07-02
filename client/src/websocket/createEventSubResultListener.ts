import _ from "lodash";
import {
  type BaseEventSubResultMessage,
  listenEventSubResultMessage,
} from "./listenMessage/listenEventSubResultMessage.ts";

export const createEventSubResultListener = <
  TEventParams extends { [key: string]: unknown },
  TEventData extends { [key: string]: unknown },
  TEventName extends string,
>({
  eventName,
}: {
  eventName: TEventName;
}) => {
  return ({
    eventParams,
    callback,
  }: {
    eventParams: TEventParams;
    callback: (callbackArg: {
      message: BaseEventSubResultMessage<TEventName, TEventParams, TEventData>;
    }) => void;
  }) => {
    return listenEventSubResultMessage((message) => {
      if (
        message.payload.eventName === eventName &&
        _.isEqual(eventParams, message.payload.eventParams)
      ) {
        callback({ message });
      }
    });
  };
};
