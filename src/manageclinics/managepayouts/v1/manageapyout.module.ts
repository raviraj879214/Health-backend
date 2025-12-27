import { Module } from "@nestjs/common";
import { ManagePayoutController } from "./manageapyout.controller";
import { MANAGE_PAYOUT_CONSTATNT } from "../constant/manageapyout.constant";
import { ManagePayoutServices } from "./manageapyout.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "src/common/guards/roles.guards";






@Module({
     controllers:[ManagePayoutController],
     providers:[
        {
            provide : MANAGE_PAYOUT_CONSTATNT,
            useClass : ManagePayoutServices
        },
        RolesGuard, JwtService , PrismaService
     ],
     exports: [MANAGE_PAYOUT_CONSTATNT],
})
export class ManagePayoutModule{}