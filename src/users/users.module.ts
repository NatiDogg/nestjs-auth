import { Module } from '@nestjs/common';
import { BcryptService } from '../utils/bcryptService';
import { JwtService } from '../utils/jwtService';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, BcryptService, JwtService],
  exports: [UsersService, BcryptService, JwtService],
})
export class UsersModule {}