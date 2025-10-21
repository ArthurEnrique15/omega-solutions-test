import jwt from 'jsonwebtoken';
import { mock, MockProxy } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { AuthenticateUserService } from './authenticate-user.service';
import { User } from '../../database/entities/user.entity';
import { BcryptProvider } from '../../providers/bcrypt.provider';

jest.mock('jsonwebtoken');

describe('AuthenticateUserService', () => {
  let sut: AuthenticateUserService;
  let mockUserRepository: MockProxy<Repository<User>>;
  let mockBcryptProvider: MockProxy<BcryptProvider>;

  const mockToken = 'jwt_token_123';

  const params = {
    email: 'john@example.com',
    password: 'Password123!',
  };

  const mockUser = {
    id: '123',
    name: 'John Doe',
    email: params.email,
    password: 'hashed_password',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  beforeAll(() => {
    mockUserRepository = mock<Repository<User>>();
    mockBcryptProvider = mock<BcryptProvider>();
    sut = new AuthenticateUserService(mockUserRepository, mockBcryptProvider);

    mockUserRepository.findOne.mockResolvedValue(mockUser);
    mockBcryptProvider.compare.mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);
  });

  it('should call userRepository.findOne with the correct email', async () => {
    await sut.execute(params);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: params.email },
    });
  });

  it('should throw if user not found', async () => {
    mockUserRepository.findOne.mockResolvedValueOnce(null);
    await expect(sut.execute(params)).rejects.toThrow('Invalid credentials');
  });

  it('should call bcryptProvider.compare with the correct password', async () => {
    await sut.execute(params);
    expect(mockBcryptProvider.compare).toHaveBeenCalledWith(params.password, mockUser.password);
  });

  it('should throw if password is invalid', async () => {
    mockBcryptProvider.compare.mockResolvedValueOnce(false);
    await expect(sut.execute(params)).rejects.toThrow('Invalid credentials');
  });

  it('should call jwt.sign with the correct payload', async () => {
    await sut.execute(params);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id, email: mockUser.email },
      expect.any(String),
      { expiresIn: '24h' },
    );
  });

  it('should use JWT_SECRET from environment', async () => {
    const customSecret = 'custom-jwt-secret';
    process.env.JWT_SECRET = customSecret;

    await sut.execute(params);

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id, email: mockUser.email },
      customSecret,
      { expiresIn: '24h' },
    );

    delete process.env.JWT_SECRET;
  });

  it('should use default JWT secret if not in environment', async () => {
    delete process.env.JWT_SECRET;

    await sut.execute(params);

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id, email: mockUser.email },
      'your-secret-key',
      { expiresIn: '24h' },
    );
  });

  it('should return the token', async () => {
    const result = await sut.execute(params);
    expect(result).toEqual({ token: mockToken });
  });
});
