import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  body: any;
  headers: any;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is not set in environment variables. Please add it to your .env file.');
}

export const authMiddleware: RequestHandler = (req, res, next): void => {
  const authReq = req as AuthRequest;
  const authHeader = authReq.headers['authorization'] as string | undefined;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'No token provided. Please login.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    authReq.userId = decoded.userId;
    authReq.userEmail = decoded.email;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid or expired token. Please login again.' });
  }
}
