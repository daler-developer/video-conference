import _ from "lodash";
import {
  type BaseEventSubResultMessage,
  onEventSubResultMessage,
} from "./listenMessage/onEventSubResultMessage.ts";
import {
  type BaseEventSubOutgoingMessage,
  sendEventSubMessage,
} from "./sendMessage/sendEventSubMessage.ts";
import useLatest from "../../shared/hooks/useLatest.ts";
import { useEffect } from "react";
import { sendEventUnsubMessage } from "./sendMessage/sendEventUnsubMessage.ts";
import type { BaseOutgoingMessage } from "./types.ts";

type HookOptions<TOutgoingMessage extends BaseEventSubOutgoingMessage> = {
  eventParams: TOutgoingMessage["payload"]["eventParams"];
  onData: (onDataOptions: { message: any }) => void;
};

export const createEventSub = <
  TOutgoingMessage extends BaseEventSubOutgoingMessage,
>({
  eventName,
}: {
  eventName: TOutgoingMessage["payload"]["eventName"];
}) => {
  const eventSub = ({
    eventParams,
    callback,
  }: {
    eventParams: TOutgoingMessage["payload"]["eventParams"];
    callback: (callbackArg: { message: any }) => void;
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

  const useHook = ({ eventParams, onData }: HookOptions<TOutgoingMessage>) => {
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

  return {
    hook: useHook,
  };
};
