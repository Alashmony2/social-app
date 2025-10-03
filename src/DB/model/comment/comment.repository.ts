import { IComment } from "../../../utils";
import { AbstractRepository } from "../../abstract.repository";
import { Comment } from "./comment.model";

export class commentRepository extends AbstractRepository<IComment>{
    constructor(){
        super(Comment)
    }
}