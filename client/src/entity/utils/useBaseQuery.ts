import { useEffect, useState } from "react";
import { queryCache } from "@/entity/query-cache/QueryCache.ts";
import { useForceRender } from "@/shared/hooks";
import {
  type BaseQueryData,
  type BaseQueryParams,
  type BaseQueryPageParam,
} from "../query-cache/Query";
import {
  QueryObserver,
  type QueryObserverOptions,
} from "../query-cache/QueryObserver";
import { type QueryAdapter } from "../adapters/createQueryAdapterForWebsocket";

export const useBaseQuery = <
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
>(
  queryObserverOptions: QueryObserverOptions<
    TQueryParams,
    TQueryData,
    TQueryPageParam
  >,
) => {
  const forceRender = useForceRender();

  const [observer] = useState(new QueryObserver(queryObserverOptions));

  const query = observer.getQuery();

  useEffect(() => {
    const unsubscribe = query.subscribe((event) => {
      if (event.type === "state-updated") {
        forceRender();
      }
    });

    return () => {
      unsubscribe();
      observer.destroy();
    };
  }, [observer, query, forceRender]);

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
