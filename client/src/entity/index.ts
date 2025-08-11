import {
  startMutation,
  useStartSession,
  StartSessionError,
} from "./mutations/startSession.ts";
import {
  useSendMediaFrame,
  SendMediaFrameError,
} from "./mutations/sendMediaFrame.ts";
import { useNewMediaFrameSub } from "./event-subs/newMediaFrameSub.ts";
import { useGetUsersQuery, useGetUsersLazyQuery } from "./queries/getUsers.ts";

export {
  startMutation,
  useSendMediaFrame,
  SendMediaFrameError,
  useStartSession,
  StartSessionError,
  useNewMediaFrameSub,
  useGetUsersQuery,
  useGetUsersLazyQuery,
};
