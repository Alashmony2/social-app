import { ObjectId } from "mongoose";
import { IAttachment, IReaction } from "../../../utils";

export class Post {
  userId: ObjectId;
  content: string;
  reactions?: IReaction[];
  attachment?: IAttachment[];
}
