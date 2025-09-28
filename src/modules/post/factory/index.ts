import { CreatePostDTO } from "../post.dto";
import { IUser } from "../../../utils";
import { Post } from "../entity";

export class PostFactoryService {
  createPost(createPostDTO: CreatePostDTO, user: IUser) {
    const newPost = new Post();
    newPost.content = createPostDTO.content;
    newPost.userId = user._id;
    newPost.reactions = [];
    newPost.attachment = [];
    return newPost;
  }
}
