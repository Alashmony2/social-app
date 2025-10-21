import { Request, Response } from "express";
import { CreatePostDTO } from "./post.dto";
import { PostFactoryService } from "./factory";
import { PostRepository } from "./../../DB";
import {
  BadRequestException,
  NotAuthorizedException,
  NotFoundException,
} from "../../utils";
import { addReactionProvider } from "../../utils/common/providers/react.provider";

class PostService {
  private readonly postFactoryService = new PostFactoryService();
  private readonly postRepository = new PostRepository();
  public create = async (req: Request, res: Response) => {
    //get data from request
    const createPostDTO: CreatePostDTO = req.body;
    //factory >> prepare data post >> post entity >> repository
    const post = this.postFactoryService.createPost(createPostDTO, req.user);
    //repository >> post entity >> DB
    const createdPost = await this.postRepository.create(post);

    //send response
    return res.status(201).json({
      message: "Post created successfully",
      success: true,
      data: { createdPost },
    });
  };

  public addReaction = async (req: Request, res: Response) => {
    //get data from request
    const { id } = req.params;
    const { reaction } = req.body;
    const userId = req.user._id;
    addReactionProvider(this.postRepository, id, userId, reaction);
    //send response
    return res.sendStatus(204);
  };

  public getSpecific = async (req: Request, res: Response) => {
    //get data from req
    const { id } = req.params;
    const post = await this.postRepository.getOne(
      { _id: id },
      {},
      {
        populate: [
          { path: "userId", select: "fullName firstName lastName" },
          { path: "reactions.userId", select: "fullName firstName lastName" },
          { path: "comments", match: { parentId: null } },
        ],
      }
    );
    console.log(post.populate);
    if (!post) throw new NotFoundException("Post not found");
    return res
      .status(200)
      .json({ message: "done", success: true, data: { post } });
  };

  public deletePost = async (req: Request, res: Response) => {
    //get data from request
    const { id } = req.params;
    //check post existence
    const postExist = await this.postRepository.exist({ _id: id });
    if (!postExist) throw new NotFoundException("Post not found");
    //check authorization
    if (postExist.userId.toString() != req.user._id.toString())
      throw new NotAuthorizedException(
        "You are not authorized to delete this post"
      );
    //delete from DB
    await this.postRepository.delete({ _id: id });
    //send response
    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  };

  public freezePost = async (req: Request, res: Response) => {
    //get data from request
    const { id } = req.params;
    //check post existence
    const postExist = await this.postRepository.exist({ _id: id });
    if (!postExist) throw new NotFoundException("Post not found");
    //check authorization
    if (postExist.userId.toString() != req.user._id.toString())
      throw new NotAuthorizedException(
        "You are not authorized to freeze this post"
      );
    //check if post is already frozen
    if (postExist.isFreezing)
      throw new BadRequestException("Post is already frozen");
    //update DB
    await this.postRepository.update({ _id: id }, { isFreezing: true });
    //send response
    return res.status(200).json({
      message: "Post frozen successfully",
      success: true,
    });
  };

  public unfreezePost = async (req: Request, res: Response) => {
    //get data from request
    const { id } = req.params;
    //check post existence
    const postExist = await this.postRepository.exist({ _id: id });
    if (!postExist) throw new NotFoundException("Post not found");
    //check authorization
    if (postExist.userId.toString() != req.user._id.toString())
      throw new NotAuthorizedException(
        "You are not authorized to unfreeze this post"
      );
    //check if post is already unfrozen
    if (!postExist.isFreezing)
      throw new BadRequestException("Post is not frozen");
    //update DB
    await this.postRepository.update({ _id: id }, { isFreezing: false });
    //send response
    return res.status(200).json({
      message: "Post unfrozen successfully",
      success: true,
    });
  };

  public update = async (req: Request, res: Response) => {
    //get data from request
    const { content }: CreatePostDTO = req.body;
    const { id } = req.params;
    //check post existence
    const postExist = await this.postRepository.exist({ _id: id });
    if (!postExist) throw new NotFoundException("Post not found");
    //check authorization
    if (postExist.userId.toString() != req.user._id.toString())
      throw new NotAuthorizedException(
        "You are not authorized to update this post"
      );
    //update DB
    await this.postRepository.update({ _id: id }, { content });
    //send response
    return res.status(200).json({
      message: "Post updated successfully",
      success: true,
    });
  };
}

export default new PostService();
