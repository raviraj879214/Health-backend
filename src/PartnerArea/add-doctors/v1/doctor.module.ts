import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DoctorController } from "./doctor.controller";
import { DOCTOR_CONSTANT_SERVICES } from "../constant/doctor.constant";
import { DoctorServices } from "./doctor.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtStrategy } from "src/PartnerArea/ClinicAuth/JwtStrategy/jwt.strategy";
import { FileModule } from "src/common/middleware/modules/file.module";
import { UploadMiddleware } from "src/common/middleware/upload.middleware";
import { join } from "path";






@Module({
     imports : [FileModule],
    controllers:[DoctorController],
    providers :[
        {
            provide : DOCTOR_CONSTANT_SERVICES,
            useClass : DoctorServices
        },
        PrismaService,
        JwtStrategy

    ],
    exports:[DOCTOR_CONSTANT_SERVICES]
})
export class DoctorModule implements NestModule{

  configure(consumer: MiddlewareConsumer) 
  {

     consumer.apply(UploadMiddleware(join(process.cwd(), 'uploads', 'doctors/profilepicture'))).forRoutes('v1/api/doctors/create-doctor');


  }
}