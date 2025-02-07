import { ExpressContext } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

export const authMiddleware = ({ req }: ExpressContext) => {
  // Allow token to be sent via req.body, req.query, or headers
  let token = req.body.token || req.query.token || req.headers.authorization;

  // ["Bearer", "<tokenvalue>"]
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
    return { req };
  }

  if (!token) {
    return req;
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY || '';
    const { _id, username, email } = jwt.verify(token, secretKey) as JwtPayload;
    req.user = { _id, username, email };
  } catch (err) {
    console.error('Invalid token');
  }

  return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '2h' });
};

export const AuthenticationError = new Error('You need to be logged in!');