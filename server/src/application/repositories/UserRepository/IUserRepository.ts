export interface IUserRepository {
  addOne(): Promise<void>;
  getOneById(): Promise<void>;
}
