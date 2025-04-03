import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user';

const UserController = {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const response = await UserService.createUser(data);
      return res
        .status(200)
        .json({ response, success: true, source: 'model' });
    } catch (e: any) {
      return next(e);
    }
  },
};

export default UserController;
