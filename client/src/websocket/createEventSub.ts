import _ from "lodash";
import {
  type BaseEventSubResultMessage,
  onEventSubResultMessage,
} from "./listenMessage/onEventSubResultMessage.ts";
import {
  type BaseEventSubIncomingMessage,
  type BaseEventSubOutgoingMessage,
  sendEventSubMessage,
} from "./sendMessage/sendEventSubMessage.ts";
import useLatest from "../../shared/hooks/useLatest.ts";
import { useEffect } from "react";
import { sendEventUnsubMessage } from "./sendMessage/sendEventUnsubMessage.ts";

type HookOptions<
  TOutgoingMessage extends BaseEventSubOutgoingMessage,
  TIncomingMessage extends BaseEventSubIncomingMessage,
> = {
  eventParams: TOutgoingMessage["payload"]["eventParams"];
  onData: (onDataOptions: { message: TIncomingMessage }) => void;
};

export const createEventSub = <
  TOutgoingMessage extends BaseEventSubOutgoingMessage,
  TIncomingMessage extends BaseEventSubIncomingMessage,
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
    callback: (callbackArg: { message: TIncomingMessage }) => void;
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
  }: HookOptions<TOutgoingMessage, TIncomingMessage>) => {
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
