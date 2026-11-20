import {
  
  Injectable,

} from '@nestjs/common';

import { User } from './interface/userInterface';


export type SafeUser = Omit<User, 'passwordHash' | 'refreshHash'>;

@Injectable()
export class UsersService {
 private users: User[] = [];
  private nextId = 1;

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const user: User = {
      id: this.nextId++,
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      roles: ['USER'],
      refreshHash: null,
    };

    this.users.push(user);
    return user;
  }

  async setRefreshHash(id: number, hash: string | null): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      user.refreshHash = hash;
    }
  }
}
