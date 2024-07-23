import { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../models/user/types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: string | JwtPayload | IUser;
  }
}
