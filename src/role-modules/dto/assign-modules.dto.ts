import { IsInt, IsArray } from 'class-validator';

export class AssignModulesDto {
  @IsInt()
  roleId: number;

  @IsArray()
  @IsInt({ each: true })
  moduleIds: number[];
}