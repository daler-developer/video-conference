import { useEffect } from "react";
import { useLatest } from "@/shared/hooks";

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
> = {
  callback: EventSubCallback<TEventSubParams, TEventSubBaseData>;
  update?: (options: { data: TEventSubBaseData }) => void;
};

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
  callback,
  update,
}: CreateEventSubOptions<TEventSubParams, TEventSubBaseData>) => {
  const hook = function useHook({
    params,
    onData,
  }: HookOptions<TEventSubParams, TEventSubBaseData>) {
    const latestOnData = useLatest(onData);

    useEffect(() => {
      const { unsubscribe } = callback({
        params,
        onData({ data }) {
          update?.({
            data,
          });
          latestOnData.current({ data });
        },
      });

      return () => {
        unsubscribe();
      };
    }, [latestOnData]);
  };

  return {
    hook,
  };
};
