import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { TypeormDataSource } from '../../config/typeorm';
import { BcryptProvider, bcryptProviderInstance } from '../../providers/bcrypt.provider';

namespace AuthenticateUserService {
  export type Params = {
    email: string;
    password: string;
  };

  export type Result = {
    token: string;
  };
}

export class AuthenticateUserService {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly bcryptProvider: BcryptProvider,
  ) {}

  async execute({ email, password }: AuthenticateUserService.Params): Promise<AuthenticateUserService.Result> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this.bcryptProvider.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '24h' },
    );

    return { token };
  }
}

export const authenticateUserServiceInstance = new AuthenticateUserService(
  TypeormDataSource.getRepository(User),
  bcryptProviderInstance,
);
