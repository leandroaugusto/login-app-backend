import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (token == null) return res.sendStatus(401); // access denied. User without token

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).send("Token expired"); // Expired token
      }
      return res.sendStatus(403); // Invalid token
    }

    req.user = user;
    next();
  });
};
