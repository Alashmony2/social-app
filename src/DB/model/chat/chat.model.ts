import { model } from "mongoose";
import { chatSchema } from "./chat.schema";

export const Chat = model("Chat",chatSchema)
