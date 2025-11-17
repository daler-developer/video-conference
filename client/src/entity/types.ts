export type UserEntity = {
  id: number;
  fullName: string;
  conferenceId: string;
  createdAt: string;
};

export type MessageEntity = {
  id: number;
  text: string;
  likesCount: number;
};
