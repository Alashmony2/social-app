import jwt, { SignOptions } from "jsonwebtoken";
import { devConfig } from "../../config/env/dev.config";

export const generateToken = ({
  payload,
  secretKey = devConfig.JWT_SECRET as string,
  options,
}: {
  payload: object;
  secretKey?: string;
  options?: SignOptions;
}) => {
  return jwt.sign(payload, secretKey, options);
};
