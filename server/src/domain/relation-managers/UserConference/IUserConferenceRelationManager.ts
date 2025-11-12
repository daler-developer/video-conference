export interface IUserConferenceRelationManager {
  addParticipantToConference(userId: number, conferenceId: string): Promise<void>;
}
