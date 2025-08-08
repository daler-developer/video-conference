import { useEffect, useState } from "react";
import { type Schema } from "normalizr";
import { queryCache } from "@/entity/query-cache/QueryCache.ts";
import { useForceRender } from "@/shared/hooks";
import {
  type QueryOptions,
  type BaseQueryData,
  type BaseQueryParams,
  type BaseQueryPageParam,
} from "../query-cache/Query";

export type QueryAdapter<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
> = Pick<
  QueryOptions<TQueryParams, TQueryData, TQueryPageParam>,
  | "name"
  | "isInfinite"
  | "initialPageParam"
  | "getNextPageParam"
  | "callback"
  | "merge"
>;

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
>(
  {
    name,
    isInfinite,
    callback,
    initialPageParam,
    getNextPageParam,
    merge,
  }: QueryAdapter<TQueryParams, TQueryData, TQueryPageParam>,
  schema: Schema,
) => {
  const hook = function useHook({ params }: HookOptions<TQueryParams>) {
    const forceRender = useForceRender();

    const [query] = useState(() => {
      return queryCache.buildQueryOrUseExisting<
        TQueryParams,
        TQueryData,
        TQueryPageParam
      >({
        isInfinite,
        schema,
        name,
        params,
        initialPageParam,
        getNextPageParam,
        merge,
        callback,
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

  const updateData = (
    params: TQueryParams,
    callback: UpdateDataCallback<TQueryData>,
  ) => {
    const query = queryCache
      .getQueryRepository()
      .get<TQueryParams, TQueryData>({ name, params });
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
