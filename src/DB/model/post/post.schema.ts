import { Schema } from "mongoose";
import { IPost } from "../../../utils";
import { reactionSchema } from "../common";



export const postSchema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      // required: function () {
      //   if (this.attachments.length) return false;
      //   return true;
      // },
      trim: true,
    },
    reactions: [reactionSchema],
  },
  { timestamps: true }
);
