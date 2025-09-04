import { useEffect, useState } from "react";
import { useLatest } from "@/shared/hooks";
import {
  EventSubObserver,
  type EventSubObserverConfig,
} from "../event-sub-manager/EventSubObserver.ts";

export type EventSubCallback<
  TEventSubParams extends EventSubBaseParams,
  TEventSubBaseData extends EventSubBaseData,
> = (options: {
  params: TEventSubParams;
  onData: (a: { data: TEventSubBaseData }) => void;
}) => {
  unsubscribe: () => void;
};

export type CreateEventSubOptions<
  TEventSubParams extends EventSubBaseParams,
  TEventSubBaseData extends EventSubBaseData,
> = Omit<
  EventSubObserverConfig<TEventSubParams, TEventSubBaseData>,
  "params" | "onData"
>;

// {
//   name: string;
//   callback: EventSubCallback<TEventSubParams, TEventSubBaseData>;
//   update?: (options: { data: TEventSubBaseData }) => void;
// };

type HookOptions<
  TEventSubParams extends EventSubBaseParams,
  TEventSubBaseData extends EventSubBaseData,
> = {
  params: TEventSubParams;
  onData: (a: { data: TEventSubBaseData }) => void;
};

export type EventSubBaseParams = Record<string, any>;

export type EventSubBaseData = Record<string, any>;

export const createEventSub = <
  TEventSubParams extends EventSubBaseParams,
  TEventSubBaseData extends EventSubBaseData,
>({
  name,
  callback,
  update,
}: CreateEventSubOptions<TEventSubParams, TEventSubBaseData>) => {
  const hook = function useHook({
    params,
    onData,
  }: HookOptions<TEventSubParams, TEventSubBaseData>) {
    const latestOnData = useLatest(onData);

    const [eventSubObserver] = useState(
      () =>
        new EventSubObserver({
          name,
          params,
          callback,
          onData({ data }) {
            update?.({ data });
            onData({ data });
          },
        }),
    );

    useEffect(() => {
      eventSubObserver.ensureSubscribed({ params });

      return () => {
        eventSubObserver.onDestroyed();
      };
      // const { unsubscribe } = callback({
      //   params,
      //   onData({ data }) {
      //     update?.({
      //       data,
      //     });
      //     latestOnData.current({ data });
      //   },
      // });
      //
      // return () => {
      //   unsubscribe();
      // };
    }, [latestOnData, eventSubObserver]);
  };

  return {
    hook,
  };
};
