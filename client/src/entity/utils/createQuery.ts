import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { type Schema } from "normalizr";
import { queryCache } from "@/entity/query-cache/QueryCache.ts";
import { useForceRender } from "@/shared/hooks";
import type { IncomingMessageExtractPayload } from "@/websocket";

export type QueryAdapter<
  TQueryName extends string = string,
  TParams extends Record<string, any> = Record<string, any>,
  TData extends Record<string, any> = Record<string, any>,
  TPageParam extends Record<string, any> | null = null,
> = {
  name: TQueryName;
  isInfinite: boolean;
  initialPageParam: TPageParam;
  getNextPageParam: (options: {
    lastPageParam: TPageParam;
  }) => NonNullable<TPageParam>;
  callback: (options: {
    params: TParams;
    pageParam?: TPageParam;
  }) => Promise<{ data: TData }>;
  merge: (options: { existingData: TData; incomingData: TData }) => TData;
};

type HookOptions<TParams extends Record<string, any> = Record<string, any>> = {
  params: TParams;
};

type UpdateDataCallback<TData extends Record<string, any>> = (
  prev: TData,
) => TData;

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

const createQuery = <
  TParams extends Record<string, any> = Record<string, any>,
  TData extends Record<string, any> = Record<string, any>,
  TQueryName extends string = string,
  TPageParam extends Record<string, any> | null = null,
>(
  {
    name,
    isInfinite,
    callback,
    initialPageParam,
    getNextPageParam,
    merge,
  }: QueryAdapter<TQueryName, TParams, TData, TPageParam>,
  schema: Schema,
) => {
  const hook = function useHook({ params }: HookOptions<TParams>) {
    const forceRender = useForceRender();

    const [query] = useState(() => {
      return queryCache.buildQueryOrUseExisting<TParams, TData, TPageParam>({
        isInfinite,
        schema,
        name,
        params,
        initialPageParam,
        getNextPageParam,
        merge,
        async fn({ params, pageParam }) {
          await sleep();
          const { data } = await callback({ params, pageParam });

          return data;
        },
      });
    });

    useEffect(() => {
      const unsubscribe = query.subscribe((event) => {
        if (event.type === "state-updated") {
          forceRender();
        }
      });

      return () => {
        unsubscribe();
      };
    }, [query, forceRender]);

    useEffect(() => {
      return () => {
        queryCache.handleQueryUnmount(query);
      };
    }, [query]);

    return {
      data: query.getData(),
      status: query.getStatus(),
      fetchMore: query.fetchMore,
      isIdle: query.getIsIdle(),
      isFetching: query.getIsFetching(),
      isFetchingMore: query.getIsFetchingMore(),
      isSuccess: query.getIsSuccess(),
      isError: query.getIsError(),
    };
  };

  const updateData = (params: TParams, callback: UpdateDataCallback<TData>) => {
    const query = queryCache
      .getQueryRepository()
      .get<TParams, TData>({ name, params });
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

// useEffect(() => {
//   queryCache.initQuery({
//     schema,
//     name,
//     params,
//     async fn({ params }) {
//       await sleep();
//       const { data } = await callback({ params });
//
//       return data;
//     },
//   });
//
//   return () => {
//     queryCache.destroyQuery({
//       name,
//       params,
//     });
//   };
// }, []);

// queryCache.initQuery({
//   schema,
//   name,
//   params,
//   async fn({ params }) {
//     await sleep();
//     const { data } = await callback({ params });
//
//     return data;
//   },
// });

// const state = useSyncExternalStore(
//   useCallback((callback) => {
//     const query = queryCache.getQuery<TParams, TData>({ name, params });
//
//     return query.subscribe((event) => {
//       if (event.type === "state-updated") {
//         callback();
//       }
//     });
//   }, []),
//   () => {
//     const query = queryCache.getQuery<TParams, TData>({ name, params });
//
//     console.log(query);
//
//     return {
//       status: query.getStatus(),
//       data: query.getData(),
//     };
//   },
// );
