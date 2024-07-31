import jwt from "jsonwebtoken";

import {
  expiresIn,
  refreshTokenExpiresIn,
  accessTokenSecret,
  refreshTokenSecret,
} from "../constants";

export const getAccessToken = (id: string) =>
  jwt.sign({ id }, accessTokenSecret, { expiresIn });

export const getRefreshToken = (id: string) =>
  jwt.sign({ id }, refreshTokenSecret, { expiresIn: refreshTokenExpiresIn });
