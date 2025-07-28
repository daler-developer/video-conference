import { useEffect, useSyncExternalStore } from "react";
import { normalize, schema } from "normalizr";
import { type QueryAdapter } from "../adapters/createQueryAdapterForWebsocket";
import { queryCache } from "@/entity/query-cache/QueryCache.ts";

type HookOptions<TParams extends Record<string, any> = Record<string, any>> = {
  params: TParams;
};

type UpdateDateCallbackOptions = {};

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

const createQuery = <
  TParams extends Record<string, any> = Record<string, any>,
  TData extends Record<string, any> = Record<string, any>,
  TQueryName extends string = string,
>({
  name,
  callback,
}: QueryAdapter<TQueryName, TParams, TData>) => {
  const hook = function useHook({ params }: HookOptions<TParams>) {
    useEffect(() => {
      queryCache.initQuery({
        name,
        params,
        async fn({ params }) {
          await sleep();
          const { data } = await callback({ params });

          return data;
        },
      });

      return () => {
        queryCache.destroyQuery({
          name,
          params,
        });
      };
    }, []);

    const state = useSyncExternalStore(
      (callback) => {
        return queryCache.subscribe({ name, params }, callback);
      },
      () => {
        return queryCache.getQueryState<TParams, TData>({ name, params });
      },
    );

    return {
      ...state,
    };
  };

  const updateData = (
    callback: (options: UpdateDateCallbackOptions) => void,
  ) => {
    callback();
  };

  return {
    hook,
    updateData,
  };
};

export { createQuery };
