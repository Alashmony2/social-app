import { model } from "mongoose";
import { messageSchema } from "./message.schema";

export const Message = model("Message",messageSchema)