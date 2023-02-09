import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: any[any];
  routeKey?: string;
  fields?: any[any];
  file?: Express.Multer.File;
  files?: Express.Multer.File[] | any;
  session: any;
}

export { CustomRequest, Request, Response, NextFunction };
