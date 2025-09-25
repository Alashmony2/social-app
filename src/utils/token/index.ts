import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { devConfig } from "../../config/env/dev.config";
import { IPayload } from "../common";

export const generateToken = ({
  payload,
  secretKey = devConfig.JWT_SECRET,
  options,
}: {
  payload: object;
  secretKey?: string;
  options?: SignOptions;
}) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = (
  token: string,
  secretKey: string = devConfig.JWT_SECRET
) => {
  return jwt.verify(token, secretKey) as IPayload;
};
