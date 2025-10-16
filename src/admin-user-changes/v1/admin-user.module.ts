import { Module } from "@nestjs/common";
import { Adminusercontroller } from "./admin-user.controller";
import { AdminUserService } from "./admin-user.service";
import { PrismaService } from "src/prisma/prisma.service";
import { RolesGuard } from "src/common/guards/roles.guards";
import { JwtService } from "@nestjs/jwt";




@Module({
    controllers : [Adminusercontroller],
    providers :[AdminUserService,PrismaService, RolesGuard, JwtService]
})



export class AdminUserModule{}