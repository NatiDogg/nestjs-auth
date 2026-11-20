// update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from '../../auth/dto/registerDto';

export class UpdateUserDto extends PartialType(RegisterDto) {}