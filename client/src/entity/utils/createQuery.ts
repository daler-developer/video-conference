import { queryCache } from "@/entity/query-cache/QueryCache.ts";
import {
  type BaseQueryData,
  type BaseQueryParams,
  type BaseQueryPageParam,
} from "../query-cache/Query";
import { type QueryAdapter } from "../adapters/createQueryAdapterForWebsocket";
import { useBaseQuery } from "./useBaseQuery";
import { type QueryObserverConfig } from "../query-cache/QueryObserver.ts";

type HookOptions<TQueryParams extends BaseQueryParams> = {
  params: TQueryParams;
};

type UpdateDataCallback<TQueryData extends BaseQueryData> = (
  prev: TQueryData,
) => TQueryData;

type CreateQueryOptions<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
  TQueryIsInfinite extends boolean,
> = Pick<
  QueryObserverConfig<
    TQueryParams,
    TQueryData,
    TQueryPageParam,
    any,
    TQueryIsInfinite
  >,
  | "name"
  | "callback"
  | "isInfinite"
  | "initialPageParam"
  | "getNextPageParam"
  | "merge"
  | "schema"
>;

const createQuery = <
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
  TQueryIsInfinite extends boolean,
>(
  options: CreateQueryOptions<
    TQueryParams,
    TQueryData,
    TQueryPageParam,
    TQueryIsInfinite
  >,
) => {
  const useQuery = ({ params }: HookOptions<TQueryParams>) => {
    return useBaseQuery({
      ...options,
      isLazy: false,
      params,
    });
  };

  const useLazyQuery = ({ params }: HookOptions<TQueryParams>) => {
    return useBaseQuery({
      ...options,
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
        TQueryPageParam
      >({ name: options.name, params });
    const prevData = query.data;

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
