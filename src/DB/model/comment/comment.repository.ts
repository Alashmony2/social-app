import { IComment } from "../../../utils";
import { AbstractRepository } from "../../abstract.repository";
import { Comment } from "./comment.model";

export class CommentRepository extends AbstractRepository<IComment>{
    constructor(){
        super(Comment)
    }
}