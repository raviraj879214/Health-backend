import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ManageCordinatorServices } from "./managecordinator.service";
import { ManageCordinatorController } from "./managecordinator.controller";
import { MANAGECORDINATOR } from "../constant/managecordinator.constant";





@Module({
  controllers: [ManageCordinatorController],
   providers :[
          {
              provide : MANAGECORDINATOR,
              useClass : ManageCordinatorServices
          },
          PrismaService,
         
  
      ],
      exports:[MANAGECORDINATOR]
})
export class ManageCordinatorModule{}


