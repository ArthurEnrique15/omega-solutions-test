import { mock, MockProxy } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { CreateUserService } from './create-user.service';
import { User } from '../../database/entities/user.entity';
import { BcryptProvider } from '../../providers/bcrypt.provider';

describe('CreateUserService', () => {
  let sut: CreateUserService;
  let mockUserRepository: MockProxy<Repository<User>>;
  let mockBcryptProvider: MockProxy<BcryptProvider>;

  const mockHashedPassword = 'hashed_password';

  const params = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password123!',
  };

  const mockUser = {
    id: '123',
    name: params.name,
    email: params.email,
    password: mockHashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  beforeAll(() => {
    mockUserRepository = mock<Repository<User>>();
    mockBcryptProvider = mock<BcryptProvider>();
    sut = new CreateUserService(mockUserRepository, mockBcryptProvider);

    mockBcryptProvider.hash.mockResolvedValue(mockHashedPassword);
    mockUserRepository.findOne.mockResolvedValueOnce(null);
    mockUserRepository.create.mockReturnValue(mockUser);
    mockUserRepository.save.mockResolvedValue(mockUser);
  });

  it('should call userRepository.findOne with the correct email', async () => {
    await sut.execute(params);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: params.email },
    });
  });

  it('should throw if user already exists', async () => {
    mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
    await expect(sut.execute(params)).rejects.toThrow('User already exists');
  });

  it('should call bcryptProvider.hash with the correct password', async () => {
    await sut.execute(params);
    expect(mockBcryptProvider.hash).toHaveBeenCalledWith(params.password, 10);
  });

  it('should call userRepository.create and save with the correct user', async () => {
    await sut.execute(params);
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      name: params.name,
      email: params.email,
      password: mockHashedPassword,
    });
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should return the user without the password', async () => {
    const result = await sut.execute(params);
    expect(result.user).not.toHaveProperty('password');
    expect(result.user).toEqual({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    });
  });
});
