import { NextFunction, Request, Response } from 'express';
import { Schema, ValidationError } from 'yup';

const validate = (schema: Schema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (e) {
    const error = e as ValidationError;
    return res.status(400).json({ success: false, type: error.name, message: error.message });
  }
};

export default validate;
