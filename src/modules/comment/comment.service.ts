import { Request, Response } from "express";
import { CommentRepository, PostRepository } from "../../DB";
import {
  IComment,
  IPost,
  NotAuthorizedException,
  NotFoundException,
} from "../../utils";
import { CommentFactoryService } from "./factory";
import { CreateCommentDTO } from "./comment.dto";

class CommentService {
  private readonly postRepository = new PostRepository();
  private readonly commentRepository = new CommentRepository();
  private readonly commentFactoryService = new CommentFactoryService();
  public create = async (req: Request, res: Response) => {
    //get data from req
    const { postId, id } = req.params;
    const createCommentDTO: CreateCommentDTO = req.body;
    //check post exist
    const postExist = await this.postRepository.exist({ _id: postId });
    if (!postExist) throw new NotFoundException("Post not found");
    //check comment existence
    let commentExist: IComment | any;
    if (id) {
      commentExist = await this.commentRepository.exist({ _id: id });
      if (!commentExist) throw new NotFoundException("Comment not found");
    }
    //prepare data for comment
    const comment = this.commentFactoryService.createComment(
      createCommentDTO,
      req.user,
      postExist,
      commentExist
    );
    //create into DB
    const createdComment = await this.commentRepository.create(comment);
    //send Response
    return res.status(201).json({
      message: "Comment created successfully",
      success: true,
      data: { createdComment },
    });
  };

  public getSpecific = async (req: Request, res: Response) => {
    //get data from request
    const { id } = req.params;
    const commentExist = await this.commentRepository.exist(
      { _id: id },
      {},
      { populate: [{ path: "replies" }] }
    );
    if (!commentExist) throw new NotFoundException("Comment not found");
    // send response
    return res.status(200).json({
      message: "Comment fetch successfully",
      success: true,
      data: { commentExist },
    });
  };

  public deleteComment = async (req: Request, res: Response) => {
    //get data from request
    const { id } = req.params;
    //check comment exist
    const commentExist = await this.commentRepository.exist(
      { _id: id },
      {},
      { populate: [{ path: "postId", select: "userId" }] }
    );
    if (!commentExist) throw new NotFoundException("Comment not found");
    //check authorization
    if (
      commentExist.userId.toString() != req.user._id.toString() &&
      (commentExist.postId as unknown as IPost).userId.toString() != req.user._id.toString()
    )
      throw new NotAuthorizedException(
        "You are not authorized to delete this comment"
      );
    //delete from DB
    await this.commentRepository.delete({ _id: id });
    //send response
    return res.status(200).json({
      message: "Comment deleted successfully",
      success: true,
    });
  };
}
export default new CommentService();
