// src/users/dto/update-user.dto.ts
import { IsEmail, IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsInt()
  @IsOptional()
  roleId?: number;
}
