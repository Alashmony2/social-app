import { GraphQLID } from "graphql";
import { PostResponse, PostsResponse } from "./post-type.graphql";
import { getPosts, getSpecificPost } from "./post-service.graphql";

export const postQuery = {
  getPost: {
    type: PostResponse,
    args: {
      id: { type: GraphQLID },
    },
    resolve: getSpecificPost,
  },
  getPosts: {
    type: PostsResponse,
    resolve: getPosts,
  },
};
