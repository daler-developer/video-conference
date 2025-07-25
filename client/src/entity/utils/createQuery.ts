import { create } from "zustand/index";
import { devtools } from "zustand/middleware";

type Options<TQueryName extends string, TQueryParams, TQueryData> = {
  name: TQueryName;
};

type StoreValues<TQueryName extends string> = {
  first: {
    [key: string]: any;
  };
};

const generateHash = (name: string, params: Record<string, any>) => {
  return `${name}|${JSON.stringify(params)}`;
};

const createQuery = <TQueryName extends string, TQueryParams, TQueryData>({
  name,
}: Options<TQueryName, TQueryParams, TQueryData>) => {
  const useStore = create<StoreValues<TQueryName>>()(() => ({
    [name]: {
      age: 20,
    },
  }));

  const hook = function useHook() {};
};

export { createQuery };
