import { schema } from "normalizr";
import { Repository } from "./Repository";

type NormalizedUser = {
  id: number;
  name: string;
  age: number;
};

export const userEntity = new schema.Entity("users");

export class UserRepository extends Repository<NormalizedUser> {}
