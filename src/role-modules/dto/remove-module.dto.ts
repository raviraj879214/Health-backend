import { IsInt } from 'class-validator';

export class RemoveModuleDto {
  @IsInt()
  roleId: number;

  @IsInt()
  moduleId: number;
}