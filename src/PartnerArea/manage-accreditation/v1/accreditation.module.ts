import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AccreditationController } from "./accreditation.controller";
import { ACCREDITATION_CONSTANT_SERVICE } from "../constant/accreditation.constant";
import { AccreditationService } from "./accreditation.services";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { UploadMiddleware } from "src/common/middleware/upload.middleware";
import { join } from "path";






@Module({
    controllers :[AccreditationController],
    providers :[
        {
            provide : ACCREDITATION_CONSTANT_SERVICE,
            useClass : AccreditationService
        },
        PrismaService,
        JwtAuthGuard
    ],
    exports :[ACCREDITATION_CONSTANT_SERVICE]

})


export class Accreditations implements NestModule{

  configure(consumer: MiddlewareConsumer) 
  {

     consumer.apply(UploadMiddleware(join('uploads/license'))).forRoutes('v1/api/manage-accreditation/upload-license');

  }
}