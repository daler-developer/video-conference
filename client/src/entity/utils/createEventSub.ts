import { useEffect } from "react";
import { useLatest } from "@/shared/hooks";

export type EventSubAdapter<
  TParams extends Record<string, any> = Record<string, any>,
  TData extends Record<string, any> = Record<string, any>,
> = {
  subscribe: (o: { params: TParams; onData: (a: { data: TData }) => void }) => {
    unsubscribe: () => void;
  };
};

type HookOptions<
  TParams extends Record<string, any> = Record<string, any>,
  TData extends Record<string, any> = Record<string, any>,
> = {
  params: TParams;
  onData: (a: { data: TData }) => void;
};

export const createEventSub = <
  TParams extends Record<string, any>,
  TData extends Record<string, any>,
>({
  subscribe,
}: EventSubAdapter<TParams, TData>) => {
  const hook = function useHook({
    params,
    onData,
  }: HookOptions<TParams, TData>) {
    const latestOnData = useLatest(onData);

    useEffect(() => {
      const { unsubscribe } = subscribe({
        params,
        onData: latestOnData.current,
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
