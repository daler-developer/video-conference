import { useState } from "react";
import { BaseError } from "@/websocket/BaseError.ts";
import type { MutationAdapter } from "@/entity/createMutationAdapterForWebsocket.ts";

type Status = "pending" | "idle" | "success" | "error";

const createMutation = <TMutationAdapter extends MutationAdapter>({
  callback,
}: MutationAdapter) => {
  const useMutationHook = () => {
    const [error, setError] = useState<BaseError | null>(null);
    const [data, setData] = useState<
      Awaited<ReturnType<TMutationAdapter["callback"]>>["data"] | null
    >(null);
    const [status, setStatus] = useState<Status>("idle");

    const mutate = async ({
      payload,
    }: Parameters<TMutationAdapter["callback"]>["0"]) => {
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
        setStatus("error");
        if (e instanceof BaseError) {
          setError(e);
        } else {
          alert("test");
        }
        throw e;
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
    useMutationHook,
  };
};

export default createMutation;
