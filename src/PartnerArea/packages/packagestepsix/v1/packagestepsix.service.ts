import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IPackageStepSix } from "../interface/packagestepsix.interface";
import { SavePackageFieldsDto } from "./dto/packagestepsix.update.dto";




@Injectable()
export class PackageStepSixServices implements IPackageStepSix{
    constructor(private readonly prisma:PrismaService){}


     async getFieldDefinitions() {
        return this.prisma.packageFieldDefinition.findMany({
        orderBy: { createdAt: 'asc' },
        });
    }

    async getPackageFields(packageId: string) {
    return this.prisma.packageFieldValue.findMany({
      where: { packageId },
      include: { field: true },
    });
  }


    async savePackageFields(dto: SavePackageFieldsDto) {
    const { packageId, fields } = dto;

    for (const item of fields) {
      const definition = await this.prisma.packageFieldDefinition.findUnique({
        where: { id: item.fieldId },
      });

      if (!definition) {
        throw new BadRequestException(`Invalid fieldId: ${item.fieldId}`);
      }

      this.validateFieldValue(definition.fieldType, item);

      await this.prisma.packageFieldValue.upsert({
        where: {
          packageId_fieldId: {
            packageId,
            fieldId: item.fieldId,
          },
        },
        update: {
          valueText: item.valueText ?? null,
          valueNumber: item.valueNumber ?? null,
          valueBoolean: item.valueBoolean ?? null,
          valueDate: item.valueDate ? new Date(item.valueDate) : null,
        },
        create: {
          packageId,
          fieldId: item.fieldId,
          valueText: item.valueText ?? null,
          valueNumber: item.valueNumber ?? null,
          valueBoolean: item.valueBoolean ?? null,
          valueDate: item.valueDate ? new Date(item.valueDate) : null,
        },
      });
    }

    return { message: 'Package fields saved successfully' };
  }


  
  public validateFieldValue(type: string, item: any) {
    switch (type) {
      case 'text':
        if (!item.valueText) throw new BadRequestException('Text value required');
        break;
      case 'number':
        if (item.valueNumber === undefined) throw new BadRequestException('Number value required');
        break;
      case 'boolean':
        if (item.valueBoolean === undefined) throw new BadRequestException('Boolean value required');
        break;
      case 'date':
        if (!item.valueDate) throw new BadRequestException('Date value required');
        break;
    }
  }

    






  
 }




 



