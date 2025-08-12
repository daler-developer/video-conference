import { useEffect, useState } from "react";
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

export const useBaseQuery = <
  TQueryParams extends BaseQueryParams,
  TQueryData extends BaseQueryData,
  TQueryPageParam extends BaseQueryPageParam,
  TQueryIsInfinite extends boolean,
  TQueryObserverIsLazy extends boolean,
>(
  queryObserverOptions: QueryObserverOptions<
    TQueryParams,
    TQueryData,
    TQueryPageParam,
    TQueryIsInfinite,
    TQueryObserverIsLazy
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

  return observer.createResult();
};
