import { GraphQLID } from "graphql";
import { PostType } from "./post-type.graphql";
import { getSpecificPost } from "./post-service.graphql";

export const postQuery = {
  getPost: {
    type: PostType,
    args: {
      id: { type: GraphQLID },
    },
    resolve: getSpecificPost,
  },
};
