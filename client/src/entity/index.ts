import {
  useStartSession,
  StartSessionError,
} from "./mutations/startSession.ts";
import {
  useSendMediaFrameMutation,
  SendMediaFrameMutationError,
} from "./mutations/sendMediaFrame.ts";
import { useNewMediaFrameSub } from "./event-subs/newMediaFrameSub.ts";
import { useGetUsersQuery, useGetUsersLazyQuery } from "./queries/getUsers.ts";
import {
  useGetUsersInfiniteQuery,
  useGetUsersInfiniteLazyQuery,
} from "./queries/getUsersInfinite.ts";
import { GetUsersQueryError } from "./queries/getUsers.ts";

export {
  useSendMediaFrameMutation,
  SendMediaFrameMutationError,
  useStartSession,
  StartSessionError,
  useNewMediaFrameSub,
  useGetUsersQuery,
  useGetUsersInfiniteQuery,
  useGetUsersInfiniteLazyQuery,
  useGetUsersLazyQuery,
  GetUsersQueryError,
};
