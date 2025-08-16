import { useEffect, useState } from "react";
import { useForceRender } from "@/shared/hooks";
import {
  type BaseQueryData,
  type BaseQueryParams,
  type BaseQueryPageParam,
} from "../query-cache/Query";
import {
  QueryObserver,
  type QueryObserverConfig,
} from "../query-cache/QueryObserver";

export const useBaseQuery = <
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
  TQueryObserverIsLazy extends boolean,
  TQueryIsInfinite extends boolean,
>(
  queryObserverOptions: QueryObserverConfig<
    TQueryParams,
    TQueryData,
    TQueryPageParam,
    TQueryObserverIsLazy,
    TQueryIsInfinite
  >,
) => {
  const forceRender = useForceRender();

  const [observer] = useState(() => new QueryObserver(queryObserverOptions));

  const query = observer.query;

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

  return observer.createResult();
};
