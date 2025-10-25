import { PostRepository } from "../../../DB";

export const getSpecificPost = async(parent, args) => {
      const postRepo = new PostRepository();
      const post = await postRepo.getOne(
        { _id: args.id },
        {},
        { populate: [{ path: "userId" }] }
      );
      if (!post) throw new Error("post not found");
      return {
        message:"done",
        success:true,
        data:post
      };
    }

    export const getPosts = async(parent, args) => {
      const postRepo = new PostRepository();
      const posts = await postRepo.getAll(
        {},
        {},
        { populate: [{ path: "userId" }] }
      );
      return {
        message:"done",
        success:true,
        data:posts
      };
    }