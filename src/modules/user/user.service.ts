import { Request, Response } from "express";
import { UserRepository } from "../../DB/model/user/user.repository";
import { BadRequestException, NotFoundException } from "../../utils";
import { ObjectId } from "mongoose";
import { objectUtil } from "zod/v3";

class UserService {
  private readonly userRepository = new UserRepository();
  constructor() {}
  public getProfile = async (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ message: "done", success: true, data: { user: req.user } });
  };

  public sendFriendRequest = async (req: Request, res: Response) => {
    //get data from request
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    if (senderId.toString() === receiverId)
      throw new BadRequestException("You cannot send a request to yourself");
    const sender = await this.userRepository.exist({ _id: senderId });
    const receiver = await this.userRepository.exist({ _id: receiverId });
    if (!sender || !receiver) throw new NotFoundException("User not found");
    // already friends
    if (sender.friends.includes(receiverId as unknown as ObjectId))
      throw new BadRequestException("Already friends");
    // already sent request
    if (sender.sentRequests.includes(receiverId as unknown as ObjectId))
      throw new BadRequestException("Already sent request");
    // already received request
    if (sender.friendRequests.includes(receiverId as unknown as ObjectId))
      throw new BadRequestException(
        "You already have a request from this user"
      );
    // add both sides
    await this.userRepository.update(
      { _id: senderId },
      { $push: { sentRequests: receiverId } }
    );

    await this.userRepository.update(
      { _id: receiverId },
      { $push: { friendRequests: senderId } }
    );
    return res.status(200).json({
      message: "Friend request sent successfully",
      success: true,
    });
  };

  public acceptFriendRequest = async (req: Request, res: Response) => {
    //get data from request
    const { id: senderId } = req.params;
    const receiverId = req.user._id;

    const sender = await this.userRepository.exist({ _id: senderId });
    const receiver = await this.userRepository.exist({ _id: receiverId });
    if (!sender || !receiver) throw new NotFoundException("User not found");
    // already friends
    if (sender.friends.includes(receiverId as unknown as ObjectId))
      throw new BadRequestException("Already friends");
    // check if request exists
    if (!receiver.friendRequests.includes(senderId as unknown as ObjectId))
      throw new BadRequestException("No friend request from this user");

    // update both sides
    await this.userRepository.update(
      { _id: receiverId },
      {
        $pull: { friendRequests: senderId },
        $push: { friends: senderId },
      }
    );

    await this.userRepository.update(
      { _id: senderId },
      {
        $pull: { sentRequests: receiverId },
        $push: { friends: receiverId },
      }
    );
    return res.status(200).json({
      message: "Friend request accepted successfully",
      success: true,
    });
  };

  public deleteFriendRequest = async (req: Request, res: Response) => {
    const { id: senderId } = req.params;
    const receiverId = req.user._id;

    const sender = await this.userRepository.exist({ _id: senderId });
    const receiver = await this.userRepository.exist({ _id: receiverId });

    if (!sender || !receiver) throw new NotFoundException("User not found");

    if (!receiver.friendRequests.includes(senderId as unknown as ObjectId))
      throw new BadRequestException("No friend request from this user");

    // remove request from both sides
    await this.userRepository.update(
      { _id: receiverId },
      { $pull: { friendRequests: senderId } }
    );

    await this.userRepository.update(
      { _id: senderId },
      { $pull: { sentRequests: receiverId } }
    );

    return res.status(200).json({
      message: "Friend request declined successfully",
      success: true,
    });
  };
}

export default new UserService();
