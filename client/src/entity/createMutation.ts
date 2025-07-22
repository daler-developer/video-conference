import { useState } from "react";
import type { MutationAdapter } from "@/entity/createMutationAdapterForWebsocket.ts";
import { ApiError } from "./ApiError.ts";

type Status = "pending" | "idle" | "success" | "error";

type Mutate<TMutationAdapter extends MutationAdapter<any, any, any>> =
  (options: {
    payload: Parameters<TMutationAdapter["callback"]>[0]["payload"];
    handleError?: (e: InstanceType<TMutationAdapter["Error"]>) => void;
  }) => Promise<{
    data: NonNullable<
      Awaited<ReturnType<TMutationAdapter["callback"]>>["data"]
    >;
  }>;

const createMutation = <
  TMutationAdapter extends MutationAdapter<any, any, any>,
>({
  callback,
  Error,
}: TMutationAdapter) => {
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
        setData(data);
        setStatus("success");
        return {
          data,
        };
      } catch (e) {
        if (e instanceof Error) {
          setStatus("error");
          setError(e);
          handleError?.(e);
          throw e;
        } else {
          alert("test");
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
    Error,
    useMutationHook,
  };
};

export default createMutation;
