import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ error: 'Invalid token' });

  (req as any).user = decoded; // attach decoded token to request
  next();
}
