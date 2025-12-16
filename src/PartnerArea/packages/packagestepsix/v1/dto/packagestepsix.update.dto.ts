import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';



export class SavePackageFieldItemDto {
  @IsUUID()
  fieldId: string;

  @IsOptional()
  @IsString()
  valueText?: string;

  @IsOptional()
  valueNumber?: number;

  @IsOptional()
  valueBoolean?: boolean;

  @IsOptional()
  valueDate?: string;
}

export class SavePackageFieldsDto {
  @IsUUID()
  packageId: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  fields: SavePackageFieldItemDto[];
}
