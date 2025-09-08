import { time } from "console";

export const generateOTP = (): string => {
  return Math.floor(Math.random() * 99999 + 10000) as unknown as string;
};

export const generateExpiryDate = (time: number) => {
  return Date.now() + time;
};
