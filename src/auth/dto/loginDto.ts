import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email is Required' })
  @IsEmail({}, { message: 'Please Provide a Valid Email' })
  email!: string;

  @IsNotEmpty({ message: 'Password is Required' })
  @IsString()
  password!: string;
}