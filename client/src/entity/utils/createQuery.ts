import { useEffect, useSyncExternalStore } from "react";
import { normalize, type Schema, schema } from "normalizr";
import { type QueryAdapter } from "../adapters/createQueryAdapterForWebsocket";
import { queryCache } from "@/entity/query-cache/QueryCache.ts";

type HookOptions<TParams extends Record<string, any> = Record<string, any>> = {
  params: TParams;
};

type UpdateDataCallback<TData extends Record<string, any>> = (
  prev: TData,
) => TData;

const sleep = () => new Promise((resolve) => setTimeout(resolve, 200));

const createQuery = <
  TParams extends Record<string, any> = Record<string, any>,
  TData extends Record<string, any> = Record<string, any>,
  TQueryName extends string = string,
>(
  { name, callback }: QueryAdapter<TQueryName, TParams, TData>,
  schema: Schema,
) => {
  const hook = function useHook({ params }: HookOptions<TParams>) {
    useEffect(() => {
      queryCache.initQuery({
        schema,
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
        const query = queryCache.getQuery<TParams, TData>({ name, params });

        return query.subscribe((event) => {
          if (event.type === "state-updated") {
            callback();
          }
        });
      },
      () => {
        return queryCache
          .getQuery<TParams, TData>({ name, params })
          ?.getState();
      },
    );

    return {
      ...state,
    };
  };

  const updateData = (params: TParams, callback: UpdateDataCallback<TData>) => {
    const query = queryCache.getQuery<TParams, TData>({ name, params });
    const prevData = query.getData();

    if (prevData) {
      const newData = callback(prevData);
      query.setData(newData);
    }
  };

  return {
    hook,
    updateData,
  };
};

export { createQuery };
