import { Module } from "@nestjs/common";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";
import { RequestController } from "./request.controller";
import { RequestServices } from "./request.service";
import { REQUESTCONST } from "../constant/request.constant";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { EmailService } from "src/EmailServices/email.service";









@Module({
    imports:[UniversalNotificationnModule],
    controllers:[RequestController],
    providers:[
               {
                   provide : REQUESTCONST,
                   useClass : RequestServices
               },
               PrismaService,
               JwtAuthGuard,
               EmailService
       ],
       exports:[REQUESTCONST]
})
export class RequestClinic{}