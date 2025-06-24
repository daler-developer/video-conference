import { useEffect } from "react";
import websocketClient from "./WebsocketClient.ts";
import useLatest from "../shared/hooks/useLatest.ts";

type Options = {
  eventName: string;
  onData: (message: any) => void;
};

const useEventSub = ({ eventName, onData }: Options) => {
  const latestOnData = useLatest(onData);

  useEffect(() => {
    websocketClient.sendMessage({
      type: "EVENT_SUB",
      payload: {
        eventName,
        eventParams: {
          conferenceId: "test",
        },
      },
    });

    const off = websocketClient.onMessage((message) => {
      if (
        message.type === "EVENT_SUB_RESULT" &&
        message.eventName === eventName
      ) {
        latestOnData.current(message);
      }
    });

    return () => {
      off();
    };
  }, [eventName, latestOnData]);
};

export default useEventSub;
