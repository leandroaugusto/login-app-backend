import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Sem token, acesso negado

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).send('Token expired'); // Token expirado
      }
      return res.sendStatus(403); // Token inválido
    }

    req.user = user;
    next();
  });
};
