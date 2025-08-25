import { useState } from "react";
import type { MutationAdapter } from "@/entity/adapters/createMutationAdapterForWebsocket.ts";
import { ApiError } from "../ApiError.ts";
import { type EntityManager } from "../query-cache/entity-manager/EntityManager.ts";
import { queryCache } from "../query-cache/QueryCache.ts";

type Status = "pending" | "idle" | "success" | "error";

type Mutate<TMutationPayload, TMutationData> = (options: {
  payload: TMutationPayload;
  handleError?: (e: any) => void;
}) => Promise<TMutationData>;

type UpdateOptions = {
  entityManager: EntityManager;
};

export type MutationCallback<TMutationPayload, TMutationData> = (options: {
  payload: TMutationPayload;
}) => Promise<TMutationData>;

type CreateMutationError<TMutationPayload, TMutationData> = {
  callback: MutationCallback<TMutationPayload, TMutationData>;
  update?: (updateOptions: UpdateOptions) => void;
};

const createMutation = <TMutationPayload, TMutationData>({
  callback,
  update,
}: CreateMutationError<TMutationPayload, TMutationData>) => {
  const useMutationHook = () => {
    const [error, setError] = useState<any | null>(null);
    const [data, setData] = useState<TMutationData | null>(null);
    const [status, setStatus] = useState<Status>("idle");

    const mutate: Mutate<TMutationPayload, TMutationData> = async ({
      payload,
      handleError,
    }) => {
      try {
        setStatus("pending");
        const data = await callback({
          payload,
        });
        update?.({
          entityManager: queryCache.getEntityManager(),
        });
        setData(data);
        setStatus("success");
        return data;
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
