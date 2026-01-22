import { Module } from "@nestjs/common";
import { ManagePackageController } from "./managepackage.controller";
import { MANAGEPACKAGECONSTANT } from "../constant/managepackage.constant";
import { ManagePackageServices } from "./managepackage.service";
import { RolesGuard } from "src/common/guards/roles.guards";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { EmailService } from "src/EmailServices/email.service";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";






@Module({
    controllers:[ManagePackageController],
    providers: [
       {
         provide: MANAGEPACKAGECONSTANT,
         useClass: ManagePackageServices,
       },
      
   
       RolesGuard, JwtService , PrismaService , EmailService
     ],
     imports:[UniversalNotificationnModule],

     exports: [MANAGEPACKAGECONSTANT],
})
export class ManagePackageModule{}