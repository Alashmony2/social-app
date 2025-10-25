import { NotFoundException, verifyToken } from "../utils";
import { UserRepository } from "../DB";

export const isAuthenticatedGraphql = async (context: any) => {
  const token: string = context.token;
  const payload = verifyToken(token);
  const userRepository = new UserRepository();
  const user = await userRepository.exist(
    { _id: payload._id },
    {},
    { populate: [{ path: "friends", select: "fullName firstName lastName" }] }
  );
  if (!user) {
    throw new NotFoundException("User Not Found");
  }
  context.user = user;
};
