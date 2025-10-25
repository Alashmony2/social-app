import { PostRepository } from "../../../DB";

export const getSpecificPost = async(parent, args) => {
      const postRepo = new PostRepository();
      const post = await postRepo.getOne(
        { _id: args.id },
        {},
        { populate: [{ path: "userId" }] }
      );
      if (!post) throw new Error("post not found");
      return post;
    }