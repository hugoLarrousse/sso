import jwt from 'jsonwebtoken';

import { UserInterface } from '../interfaces/user';


const createToken = (payload: UserInterface) => {
  const { lastConnection, ...rest } = payload;
  return jwt.sign(rest, `${process.env.JWT_SECRET_KEY}`);
};

const verifyToken = (token: string) => jwt.verify(token, `${process.env.JWT_SECRET_KEY}`) as UserInterface | null;

export {
  createToken,
  verifyToken,
};
