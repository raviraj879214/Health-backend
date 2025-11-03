// dto/update-role-module.dto.ts
import { IsInt, IsString, IsNotEmpty } from "class-validator";

export class UpdateRoleModuleDto {
  @IsInt()
  roleId: number;

  @IsInt()
  moduleId: number;

  @IsString()
  @IsNotEmpty()
  field: string; // allowGet, allowPost, allowPut, allowDelete

  @IsInt()
  value: number; // 1 or 0
}
