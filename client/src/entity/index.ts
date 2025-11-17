import {
  useStartSession,
  StartSessionError,
} from "./mutations/startSession.ts";
import { useStartConference } from "./mutations/startConference.ts";
import { useJoinConferenceMutation } from "./mutations/joinConference.ts";
import {
  useSendMediaFrameMutation,
  SendMediaFrameMutationError,
} from "./mutations/sendMediaFrame.ts";
import { useNewMediaFrameSub } from "./event-subs/newMediaFrameSub.ts";
import { useUserJoinedConferenceSub } from "./event-subs/userJoinedConferenceSub.ts";
import { useGetUsersQuery, useGetUsersLazyQuery } from "./queries/getUsers.ts";
import {
  useGetConferenceParticipantsLazyQuery,
  GetConferenceParticipantsQueryError,
  useGetConferenceParticipantsQuery,
} from "./queries/getConferenceParticipants.ts";
import {
  useGetMessagesQuery,
  useGetMessagesLazyQuery,
} from "./queries/getMessages.ts";
import {
  useGetUsersInfiniteQuery,
  useGetUsersInfiniteLazyQuery,
} from "./queries/getUsersInfinite.ts";
import { GetUsersQueryError } from "./queries/getUsers.ts";
import { type UserEntity, type MessageEntity } from "./types";

export {
  type UserEntity,
  type MessageEntity,
  useSendMediaFrameMutation,
  SendMediaFrameMutationError,
  useStartSession,
  StartSessionError,
  useStartConference,
  useJoinConferenceMutation,
  useNewMediaFrameSub,
  useUserJoinedConferenceSub,
  useGetUsersQuery,
  useGetMessagesQuery,
  useGetMessagesLazyQuery,
  useGetConferenceParticipantsLazyQuery,
  GetConferenceParticipantsQueryError,
  useGetConferenceParticipantsQuery,
  useGetUsersInfiniteQuery,
  useGetUsersInfiniteLazyQuery,
  useGetUsersLazyQuery,
  GetUsersQueryError,
};
