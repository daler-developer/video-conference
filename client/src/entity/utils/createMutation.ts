import { useState } from "react";
import { type EntityManager } from "../query-cache/entity-manager/EntityManager.ts";
import { queryCache } from "../query-cache/QueryCache.ts";
import {
  MutationError,
  type BaseMutationErrorMap,
} from "@/entity/MutationError.ts";

export type BaseMutationPayload = Record<string, any>;

export type BaseMutationData = Record<string, any>;

type MutationStatus = "pending" | "idle" | "success" | "error";

type Mutate<
  TMutationPayload extends BaseMutationPayload,
  TMutationData extends BaseMutationData,
  TMutationErrorMap extends BaseMutationErrorMap,
> = (options: {
  payload: TMutationPayload;
  handleError?: (e: MutationError<TMutationErrorMap>) => void;
}) => Promise<TMutationData>;

type UpdateOptions = {
  entityManager: EntityManager;
};

export type MutationCallback<
  TMutationPayload extends BaseMutationPayload,
  TMutationData extends BaseMutationData,
> = (options: { payload: TMutationPayload }) => Promise<TMutationData>;

type CreateMutationError<
  TMutationPayload extends BaseMutationPayload,
  TMutationData extends BaseMutationData,
> = {
  callback: MutationCallback<TMutationPayload, TMutationData>;
  update?: (updateOptions: UpdateOptions) => void;
};

const createMutation = <
  TMutationPayload extends BaseMutationPayload,
  TMutationData extends BaseMutationData,
  TMutationErrorMap extends BaseMutationErrorMap,
>({
  callback,
  update,
}: CreateMutationError<TMutationPayload, TMutationData>) => {
  const useMutationHook = () => {
    const [error, setError] = useState<MutationError<TMutationErrorMap> | null>(
      null,
    );
    const [data, setData] = useState<TMutationData | null>(null);
    const [status, setStatus] = useState<MutationStatus>("idle");

    const isError = status === "error";
    const isSuccess = status === "success";
    const isIdle = status === "idle";
    const isPending = status === "pending";

    const mutate: Mutate<
      TMutationPayload,
      TMutationData,
      TMutationErrorMap
    > = async ({ payload, handleError }) => {
      try {
        setError(null);
        setData(null);
        setStatus("pending");
        console.log("start");
        const data = await callback({
          payload,
        });
        console.log("end");
        update?.({
          entityManager: queryCache.getEntityManager(),
        });
        setData(data);
        setStatus("success");
        return data;
      } catch (e) {
        console.log("catch");
        if (e instanceof MutationError) {
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
    useMutationHook,
    Error: MutationError as typeof MutationError<TMutationErrorMap>,
  };
};

export default createMutation;
