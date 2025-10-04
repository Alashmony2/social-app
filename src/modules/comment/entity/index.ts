import { ObjectId } from "mongoose";
import { IAttachment, IReaction } from "../../../utils";

export class Comment {
  userId: ObjectId;
  postId: ObjectId;
  parentIds: ObjectId[];
  content: string;
  attachment?: IAttachment;
  reactions: IReaction[];
  mentions?: ObjectId[];
}
