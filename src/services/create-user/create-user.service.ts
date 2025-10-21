import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { TypeormDataSource } from '../../config/typeorm';
import { BcryptProvider, bcryptProviderInstance } from '../../providers/bcrypt.provider';

namespace CreateUserService {
  export type Params = {
    name: string;
    email: string;
    password: string;
  };

  export type Result = {
    user: Omit<User, 'password'>;
  };
}

export class CreateUserService {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly bcryptProvider: BcryptProvider,
  ) {}

  async execute({ name, email, password }: CreateUserService.Params): Promise<CreateUserService.Result> {
    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

    const hashedPassword = await this.bcryptProvider.hash(password, saltRounds);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    const { password: _password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword };
  }
}

export const createUserServiceInstance = new CreateUserService(
  TypeormDataSource.getRepository(User),
  bcryptProviderInstance,
);
