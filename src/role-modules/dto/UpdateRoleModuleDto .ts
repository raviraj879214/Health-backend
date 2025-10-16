// dto/update-role-module.dto.ts
import { IsInt, IsBoolean } from "class-validator";

export class UpdateRoleModuleDto {
  @IsInt()
  roleId: number;

  @IsInt()
  moduleId: number;

  @IsInt()
  status: number;
}
