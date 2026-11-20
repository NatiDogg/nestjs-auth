import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Role } from '../users/interface/userInterface';


export interface TokenPayload {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  createAccessToken(userPayload: TokenPayload): string {
    return jwt.sign(
      userPayload,
      this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN'),
      { expiresIn: '20m' },
    );
  }

  createRefreshToken(userPayload: TokenPayload): string {
    return jwt.sign(
      userPayload,
      this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN'),
      { expiresIn: '7d' },
    );
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(
      token,
      this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN'),
    ) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(
      token,
      this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN'),
    ) as TokenPayload;
  }
}