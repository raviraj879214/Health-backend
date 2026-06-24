// src/users/dto/update-user.dto.ts
import { IsEmail, IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateUserDto {
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




  @IsString()
  whatsappNumber : string

  @IsString()
  telegramNumber : string

  @IsString()
  messengerID : string

}
