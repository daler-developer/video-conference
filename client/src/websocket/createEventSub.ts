import _ from "lodash";
import {
  type BaseEventSubResultMessage,
  onEventSubResultMessage,
} from "./listenMessage/onEventSubResultMessage.ts";
import { sendEventSubMessage } from "./sendMessage/sendEventSubMessage.ts";
import useLatest from "../../shared/hooks/useLatest.ts";
import { useEffect } from "react";
import { sendEventUnsubMessage } from "./sendMessage/sendEventUnsubMessage.ts";

type HookOptions<
  TEventName extends string,
  TEventParams extends { [key: string]: any },
  TEventData extends { [key: string]: any },
> = {
  eventParams: TEventParams;
  onData: (onDataOptions: {
    message: BaseEventSubResultMessage<TEventName, TEventParams, TEventData>;
  }) => void;
};

export const createEventSub = <
  TEventParams extends { [key: string]: any },
  TEventData extends { [key: string]: any },
  TEventName extends string,
>({
  eventName,
}: {
  eventName: TEventName;
}) => {
  const eventSub = ({
    eventParams,
    callback,
  }: {
    eventParams: TEventParams;
    callback: (callbackArg: {
      message: BaseEventSubResultMessage<TEventName, TEventParams, TEventData>;
    }) => void;
  }) => {
    sendEventSubMessage({
      payload: {
        eventName,
        eventParams,
      },
    });

    const unsubscribe = onEventSubResultMessage((message) => {
      if (
        message.payload.eventName === eventName &&
        _.isEqual(eventParams, message.payload.eventParams)
      ) {
        callback({ message });
      }
    });

    return {
      stopEventSub() {
        sendEventUnsubMessage({
          payload: {
            eventName,
            eventParams,
          },
        });
        unsubscribe();
      },
    };
  };

  const useHook = ({
    eventParams,
    onData,
  }: HookOptions<TEventName, TEventParams, TEventData>) => {
    const latestOnData = useLatest(onData);
    const latestEventParams = useLatest(eventParams);

    useEffect(() => {
      const { stopEventSub } = eventSub({
        eventParams: latestEventParams.current,
        callback: latestOnData.current,
      });

      return () => {
        stopEventSub();
      };
    }, []);
  };

  return [eventSub, useHook] as const;
};
