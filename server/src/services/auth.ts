import { Request } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

export const authMiddleware = async (req: Request) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7);
    try {
      const secretKey = process.env.JWT_SECRET_KEY || '';
      const user = jwt.verify(token, secretKey) as JwtPayload;
      return { user };
    } catch (err) {
      console.error('Invalid token');
      return {};
    }
  }
  return {};
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '2h' });
};

export const authenticateToken = ({ req }: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
    req.user = data;
  } catch (err) {
    console.log('Invalid token');
  }

  return req;
};

export const AuthenticationError = new Error('You need to be logged in!');