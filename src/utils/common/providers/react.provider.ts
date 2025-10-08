import { ObjectId } from "mongoose";
import { CommentRepository, PostRepository } from "../../../DB";
import { NotFoundException } from "../../error";

export const addReactionProvider = async (
  repo: CommentRepository | PostRepository,
  id: string,
  userId: string | ObjectId,
  reaction: string
) => {
  //check post existence
  const postExist = await repo.exist({ _id: id });
  if (!postExist) throw new NotFoundException("Post not found");
  let userReactedIndex = postExist.reactions.findIndex((reaction) => {
    return reaction.userId.toString() == userId.toString();
  });
  if (userReactedIndex == -1) {
    await repo.update(
      { _id: id },
      {
        $push: {
          reactions: {
            reaction,
            userId,
          },
        },
      }
    );
  } else if ([undefined, null, ""].includes(reaction)) {
    await repo.update(
      { _id: id },
      { $pull: { reactions: postExist.reactions[userReactedIndex] } }
    );
  } else {
    await repo.update(
      { _id: id, "reactions.userId": userId },
      { "reactions.$.reaction": reaction }
    );
  }
};
