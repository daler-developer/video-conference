import { useState } from "react";
import type { MutationAdapter } from "@/entity/adapters/createMutationAdapterForWebsocket.ts";
import { ApiError } from "../ApiError.ts";
import { type EntityManager } from "../query-cache/entity-manager/EntityManager.ts";
import { queryCache } from "../query-cache/QueryCache.ts";

type Status = "pending" | "idle" | "success" | "error";

type Mutate<TMutationAdapter extends MutationAdapter<any, any, any>> =
  (options: {
    payload: Parameters<TMutationAdapter["callback"]>[0]["payload"];
    handleError?: (e: InstanceType<TMutationAdapter["Error"]>) => void;
  }) => Promise<{
    data: Awaited<ReturnType<TMutationAdapter["callback"]>>["data"];
  }>;

type UpdateOptions = {
  entityManager: EntityManager;
};

type Options = {
  update?: (updateOptions: UpdateOptions) => void;
};

const createMutation = <
  TMutationAdapter extends MutationAdapter<any, any, any>,
>(
  { callback, Error }: TMutationAdapter,
  options?: Options,
) => {
  const useMutationHook = () => {
    const [error, setError] = useState<ApiError | null>(null);
    const [data, setData] = useState<
      Awaited<ReturnType<TMutationAdapter["callback"]>>["data"] | null
    >(null);
    const [status, setStatus] = useState<Status>("idle");

    const mutate: Mutate<TMutationAdapter> = async ({
      payload,
      handleError,
    }) => {
      try {
        setStatus("pending");
        const { data } = await callback({
          payload,
        });
        options?.update?.({
          entityManager: queryCache.getEntityManager(),
        });
        setData(data);
        setStatus("success");
        return {
          data,
        };
      } catch (e) {
        if (e instanceof ApiError) {
          setStatus("error");
          setError(e);
          handleError?.(e);
          throw e;
        } else {
          console.log(e);
          alert("create mutation error");
          throw e;
        }
      }
    };

    const isError = status === "error";
    const isSuccess = status === "success";
    const isIdle = status === "idle";
    const isPending = status === "pending";

    return {
      mutate,
      data,
      error,
      isError,
      status,
      isSuccess,
      isIdle,
      isPending,
    };
  };

  return {
    Error: Error as TMutationAdapter["Error"],
    useMutationHook,
  };
};

export default createMutation;
