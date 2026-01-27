import { Injectable } from "@nestjs/common";
import { CreateOtherInformationDto } from "./create-other-information.dto";
import { IOtherInformationService } from "./other-information.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateOtherInformationDto } from "./update-other-information.dto";

@Injectable()
export class OtherInformationService
  implements IOtherInformationService {

  constructor(private readonly prisma: PrismaService) {}

  async create(
    patientQueryId: string,
    dto: CreateOtherInformationDto[]
  ) {
    return this.prisma.patientQueryOtherInformation.createMany({
      data: dto.map(item => ({
        patientQueryId,
        label: item.label,
        value: item.value
      }))
    });
  }

  async findByPatientQueryId(patientQueryId: string) {
    return this.prisma.patientQueryOtherInformation.findMany({
      where: { patientQueryId },
      orderBy: { createdAt: "asc" }
    });
  }

  async update(id: string, dto: UpdateOtherInformationDto) {
    return this.prisma.patientQueryOtherInformation.update({
      where: { id },
      data: dto
    });
  }

  async delete(id: string) {
    return this.prisma.patientQueryOtherInformation.delete({
      where: { id }
    });
  }
}
