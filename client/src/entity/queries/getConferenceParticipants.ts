import { createQuery } from "../utils/createQuery";
import { EntitySchema as UserEntitySchema } from "../query-cache/entity-manager/entities/user.ts";
import { type UserEntity } from "../types";
import { createWebsocketQueryCallback } from "../utils/createWebsocketQueryCallback.ts";

const GET_CONFERENCE_PARTICIPANTS = "GET_CONFERENCE_PARTICIPANTS";

type QueryParams = {
  conferenceId: string;
};

type QueryData = UserEntity[];

type QueryErrorMap = {};

export const {
  useQuery: useGetConferenceParticipantsQuery,
  useLazyQuery: useGetConferenceParticipantsLazyQuery,
  Error: GetConferenceParticipantsQueryError,
  updateData: updateGetConferenceParticipantsQueryData,
} = createQuery<QueryParams, QueryData, QueryErrorMap>({
  name: GET_CONFERENCE_PARTICIPANTS,
  callback: createWebsocketQueryCallback({
    outgoingMessageType: GET_CONFERENCE_PARTICIPANTS,
    createPayload({ params }) {
      return {
        conferenceId: params.conferenceId,
      };
    },
  }),
  schema: [UserEntitySchema],
});
