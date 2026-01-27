import { Module } from "@nestjs/common";
import { OtherInformationService } from "./other-information.service";
import { OtherInformationController } from "./other-information.controller";
import { PrismaService } from "src/prisma/prisma.service";


@Module({
  controllers: [OtherInformationController],
  providers: [
    OtherInformationService,
    PrismaService
  ],
  exports: [
    OtherInformationService
  ]
})
export class OtherInformationModule {}
