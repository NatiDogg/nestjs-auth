import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BcryptService } from '../utils/bcryptService';
import { JwtService, TokenPayload } from '../utils/jwtService';
import { RegisterDto } from './dto/registerDto';
import { SafeUser, UsersService } from '../users/users.service';
import { LoginDto } from './dto/loginDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const existingUser = await this.usersService.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.bcryptService.hashPassword(dto.password);

    const user = await this.usersService.create({
      name: dto.name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    };
  }

  async login(dto: LoginDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(normalizedEmail);

    const passwordMatches = user
      ? await this.bcryptService.matchPassword(dto.password, user.passwordHash)
      : false;

    if (!user || !passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const safeUser = this.toSafeUser(user);
    return this.issueTokens(safeUser);
  }

  async refresh(presentedToken: string) {
    try {
      const payload = this.jwtService.verifyRefreshToken(presentedToken);

      const user = await this.usersService.findById(payload.id);

      if (!user || !user.refreshHash) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const matches = await this.bcryptService.matchPassword(
        presentedToken,
        user.refreshHash,
      );

      if (!matches) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const safeUser = this.toSafeUser(user);
      return this.issueTokens(safeUser);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number) {
    await this.usersService.setRefreshHash(userId, null);
    return { message: 'Logged out' };
  }

  private toSafeUser(user: {
    id: number;
    name: string;
    email: string;
    roles: SafeUser['roles'];
  }): SafeUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    };
  }

  private async issueTokens(user: SafeUser) {
    const payload: TokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    };

    const accessToken = this.jwtService.createAccessToken(payload);
    const refreshToken = this.jwtService.createRefreshToken(payload);

    const refreshHash = await this.bcryptService.hashPassword(refreshToken);
    await this.usersService.setRefreshHash(user.id, refreshHash);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
