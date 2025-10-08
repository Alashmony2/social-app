import { Request, Response } from "express";
import { CommentRepository, PostRepository } from "../../DB";
import { IComment, NotFoundException } from "../../utils";
import { CommentFactoryService } from "./factory";
import { CreateCommentDTO } from "./comment.dto";

class CommentService {
  private readonly postRepository = new PostRepository();
  private readonly commentRepository = new CommentRepository();
  private readonly commentFactoryService = new CommentFactoryService();
  create = async (req: Request, res: Response) => {
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
    return res
      .status(201)
      .json({
        message: "Comment created successfully",
        success: true,
        data: { createdComment },
      });
  };
}
export default new CommentService();
