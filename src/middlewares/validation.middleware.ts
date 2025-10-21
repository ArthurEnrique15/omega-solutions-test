import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map((err: { path: (string | number)[]; message: string }) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};
