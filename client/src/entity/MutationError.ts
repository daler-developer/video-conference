import { ApiError } from "./ApiError";

export type BaseMutationErrorMap = Record<string, object>;

class MutationError<
  TErrorMap extends BaseMutationErrorMap,
> extends ApiError<TErrorMap> {}

export { MutationError };
