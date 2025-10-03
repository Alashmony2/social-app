import { model } from "mongoose";
import { commentSchema } from "./comment.schema";

export const Comment = model("Comment",commentSchema)