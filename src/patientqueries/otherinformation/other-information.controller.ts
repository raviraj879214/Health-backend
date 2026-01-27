import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateOtherInformationDto } from "./create-other-information.dto";
import { UpdateOtherInformationDto } from "./update-other-information.dto";
import { OtherInformationService } from "./other-information.service";

@Controller("other-information")
export class OtherInformationController {

  constructor(
    private readonly service: OtherInformationService
  ) {}

  @Post(":patientQueryId")
  create(
    @Param("patientQueryId") patientQueryId: string,
    @Body() dto: CreateOtherInformationDto[]
  ) {
    return this.service.create(patientQueryId, dto);
  }

  @Get(":patientQueryId")
  findAll(
    @Param("patientQueryId") patientQueryId: string
  ) {
    return this.service.findByPatientQueryId(patientQueryId);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateOtherInformationDto
  ) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.delete(id);
  }
}
