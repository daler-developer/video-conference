import { ApiError } from "./ApiError";

export type BaseQueryErrorMap = Record<string, object>;

class QueryError<
  TErrorMap extends BaseQueryErrorMap,
> extends ApiError<TErrorMap> {}

export { QueryError };
