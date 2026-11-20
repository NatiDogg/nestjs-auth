import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RefreshDto {
  @IsNotEmpty({ message: 'Refresh token is required' })
  @IsString({ message: 'Refresh token must be a string' })
  @MinLength(20, { message: 'Refresh token is invalid' })
  refreshToken!: string;
}