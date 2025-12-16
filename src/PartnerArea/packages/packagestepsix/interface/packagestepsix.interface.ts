import { PackageFieldDefinition } from "@prisma/client";
import { SavePackageFieldsDto } from "../v1/dto/packagestepsix.update.dto";




export interface IPackageStepSix{
  getFieldDefinitions();

  savePackageFields(dto: SavePackageFieldsDto);
  validateFieldValue(type: string, item: any);




}
