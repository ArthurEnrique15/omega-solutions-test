import bcrypt from 'bcrypt';

export class BcryptProvider {
  async hash(data: string, saltRounds: number): Promise<string> {
    return bcrypt.hash(data, saltRounds);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}

export const bcryptProviderInstance = new BcryptProvider();
