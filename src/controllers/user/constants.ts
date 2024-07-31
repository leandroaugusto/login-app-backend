import { CookieOptions } from "express";
import ms from "ms";

export const expiresIn = process.env.ACCESS_TOKEN_EXPIRY as string;
export const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRY as string;

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: ms(refreshTokenExpiresIn),
};
