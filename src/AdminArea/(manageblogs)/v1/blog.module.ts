import { PrismaService } from "src/prisma/prisma.service";
import { Blog_SERVICE_V1 } from "../constants/blog.constant";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "src/common/guards/roles.guards";
import { BlogServices } from "./blog.services";
import { BlogController } from "./blog.controller";
import { Module } from "@nestjs/common";







@Module({
  controllers: [BlogController],
  providers: [
    {
      provide: Blog_SERVICE_V1,
      useClass: BlogServices,
    },
    RolesGuard, JwtService , PrismaService
  ],

  exports: [Blog_SERVICE_V1],
})




 export class ManageBlogModule{}