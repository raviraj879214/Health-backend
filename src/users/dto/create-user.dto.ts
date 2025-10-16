// src/users/dto/create-user.dto.ts
import { IsEmail, IsString, IsInt, isString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsInt()
  roleId: number;

  @IsString()
  firstname : string

  @IsString()
  lastname : string

  @IsString()
  Bio : string


}
