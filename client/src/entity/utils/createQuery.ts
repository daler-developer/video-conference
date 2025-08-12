import { useEffect, useState } from "react";
import { queryCache } from "@/entity/query-cache/QueryCache.ts";
import { useForceRender } from "@/shared/hooks";
import {
  type BaseQueryData,
  type BaseQueryParams,
  type BaseQueryPageParam,
} from "../query-cache/Query";
import { QueryObserver } from "../query-cache/QueryObserver";
import { type QueryAdapter } from "../adapters/createQueryAdapterForWebsocket";
import { useBaseQuery } from "./useBaseQuery";

type HookOptions<TQueryParams extends BaseQueryParams> = {
  params: TQueryParams;
};

type UpdateDataCallback<TQueryData extends BaseQueryData> = (
  prev: TQueryData,
) => TQueryData;

const createQuery = <
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
  TQueryIsInfinite extends boolean,
>(
  adapterOptions: QueryAdapter<
    TQueryParams,
    TQueryData,
    TQueryPageParam,
    TQueryIsInfinite
  >,
) => {
  const useQuery = ({ params }: HookOptions<TQueryParams>) => {
    return useBaseQuery({
      ...adapterOptions,
      isLazy: false,
      params,
    });
  };

  const useLazyQuery = ({ params }: HookOptions<TQueryParams>) => {
    return useBaseQuery({
      ...adapterOptions,
      isLazy: true,
      params,
    });
  };

  const updateData = (
    params: TQueryParams,
    callback: UpdateDataCallback<TQueryData>,
  ) => {
    const query = queryCache
      .getQueryRepository()
      .get<
        TQueryParams,
        TQueryData,
        TQueryPageParam,
        TQueryIsInfinite
      >({ name: adapterOptions.name, params });
    const prevData = query.getData();

    if (prevData) {
      const newData = callback(prevData);
      query.setData(newData);
    }
  };

  return {
    useQuery,
    useLazyQuery,
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
