import { FilterQuery } from "mongoose";
import { IUser } from "../../utils/common/interface";
import { AbstractRepository } from "../abstract.repository";
import { User } from "./user.model";

export class UserRepository extends AbstractRepository<IUser> {
  constructor() {
    super(User);
  }
  async getSpecificUser(filter:FilterQuery<IUser>) {
    return await this.getOne(filter);
  }
}
