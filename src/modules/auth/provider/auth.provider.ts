import { UserRepository } from "../../../DB";
import { BadRequestException, NotFoundException } from "../../../utils";
import { ConfirmEmailDTO } from "../auth.dto";

export const authProvider = {
  async checkOTP(confirmEmailDto: ConfirmEmailDTO) {
    const userRepository = new UserRepository();
    //check user existence
    const userExist = await userRepository.exist({
      email: confirmEmailDto.email,
    });
    if (!userExist) {
      throw new NotFoundException("User not Found");
    }
    //check otp
    if (userExist.otp !== confirmEmailDto.otp) {
      throw new BadRequestException("Invalid OTP");
    }
    //check otp expiry
    if (userExist.otpExpiryAt < new Date()) {
      throw new BadRequestException("OTP Expired");
    }
  },
};
