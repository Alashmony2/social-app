import { model } from "mongoose";
import { postSchema } from "./post.schema";

export const Post = model("Post",postSchema)