import { Module } from "@nestjs/common";
import { PartnerRegisterController } from "./partnerregister.controller";
import { PARTNER_REGISTER_CONSTANT } from "../constant/partnerregister.constant";
import { PartnerRegisterServices } from "./partnerregister.services";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";











@Module({
    controllers:[PartnerRegisterController],
    providers:[
               {
                   provide : PARTNER_REGISTER_CONSTANT,
                   useClass : PartnerRegisterServices
               },
               PrismaService,
               JwtAuthGuard
       ],
       exports:[PARTNER_REGISTER_CONSTANT]
})
export class PartnerRegisterModule{}