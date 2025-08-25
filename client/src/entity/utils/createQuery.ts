import { queryCache } from "@/entity/query-cache/QueryCache.ts";
import {
  type BaseQueryData,
  type BaseQueryParams,
  type BaseQueryPageParam,
} from "../query-cache/Query";
import { type QueryAdapter } from "../adapters/createQueryAdapterForWebsocket";
import { useBaseQuery } from "./useBaseQuery";
import { type QueryObserverConfig } from "../query-cache/QueryObserver.ts";
import { QueryError, type BaseQueryErrorMap } from "@/entity/QueryError.ts";

type HookOptions<TQueryParams extends BaseQueryParams> = {
  params: TQueryParams;
};

type UpdateDataCallback<TQueryData extends BaseQueryData> = (
  prev: TQueryData,
) => TQueryData;

type CreateQueryOptions<
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryErrorMap extends BaseQueryErrorMap,
> = Pick<
  QueryObserverConfig<
    TQueryParams,
    TQueryData,
    TQueryErrorMap,
    null,
    any,
    false
  >,
  "name" | "callback" | "schema"
>;

const createQuery = <
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryErrorMap extends BaseQueryErrorMap,
>(
  options: CreateQueryOptions<TQueryParams, TQueryData, TQueryErrorMap>,
) => {
  const useQuery = ({ params }: HookOptions<TQueryParams>) => {
    return useBaseQuery<
      TQueryParams,
      TQueryData,
      TQueryErrorMap,
      null,
      false,
      false
    >({
      ...options,
      isInfinite: false,
      isLazy: false,
      params,
    });
  };

  const useLazyQuery = ({ params }: HookOptions<TQueryParams>) => {
    return useBaseQuery<
      TQueryParams,
      TQueryData,
      TQueryErrorMap,
      null,
      true,
      false
    >({
      ...options,
      isInfinite: false,
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
        TQueryErrorMap
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
    Error: QueryError as typeof QueryError<TQueryErrorMap>,
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
