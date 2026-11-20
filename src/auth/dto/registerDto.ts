// register.dto.ts
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Name is Required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(4, { message: 'Name must be at least 4 characters' })
  @MaxLength(20, { message: 'Name must not exceed 20 characters' })
  name!: string;

  @IsNotEmpty({ message: 'Email is Required' })
  @IsEmail({}, { message: 'Please Provide a Valid Email' })
  email!: string;

  @IsNotEmpty({ message: 'Password is Required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;
}