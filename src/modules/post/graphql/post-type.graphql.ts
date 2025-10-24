import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { UserType } from "../../user/graphql/user-type.graphql";

export const PostType = new GraphQLObjectType({
  name: "Post",
  fields: {
    _id: { type: GraphQLID },
    content: { type: GraphQLString },
    userId: {
      type: UserType,
    },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});
