import { Request, Response } from 'express';
import { CreateUserService, createUserServiceInstance } from '../services/create-user';
import { AuthenticateUserService, authenticateUserServiceInstance } from '../services/authenticate-user';

export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly authenticateUserService: AuthenticateUserService,
  ) {
  }

  async signup(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      const user = await this.createUserService.execute({ name, email, password });

      return res.status(201).json({
        message: 'User created successfully',
        user,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'User already exists') {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error creating user', error });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const { token } = await this.authenticateUserService.execute({ email, password });

      return res.json({
        message: 'Login successful',
        token,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error authenticating user', error });
    }
  }
}

export const userController = new UserController(
  createUserServiceInstance,
  authenticateUserServiceInstance,
);
