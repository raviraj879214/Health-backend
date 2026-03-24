import { Body, Controller, Get, Inject, Post, Put, Query, Req, UseGuards, Version } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";
import { BOOSTPACKAGECONSTANT } from "../constant/boostpackage.constant";
import { BoostPackageServices } from "./boostpackage.service";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import type { AuthRequest } from "src/common/decorators/auth-request.interface";
import { BoostPackageCreateDto } from "./dto/boostpackage.create.dto";
import { BoostPackageUpdateDto } from "./dto/boostpackage.update.dto";





@Controller("/api/boost-package")
@UseGuards(RolesGuard)
export class BoostPackageController{
    constructor(@Inject(BOOSTPACKAGECONSTANT) private readonly boostPackageServices:BoostPackageServices){}


        @Get("get-packages")
        @ModuleAccess("Manage Boost Package")
        @Version("1")
        async getManageSpecialties(@Query('page') page: string,@Query('limit') limit: string,@Req() request: AuthRequest){
            const userId = Number(request.user?.sub);
            const pageNumber = parseInt(page) || 0;
            const pageSize = parseInt(limit) || 0;
            
            return this.boostPackageServices.getAll(pageNumber,pageSize,userId);
        }



        @Post("create-packages")
        @ModuleAccess("Manage Boost Package")
        @Version("1")
        async createPackages(@Body() dto:BoostPackageCreateDto){
            
            return await this.boostPackageServices.createPackages(dto);
        }


        @Put("update-packages")
        @ModuleAccess("Manage Boost Package")
        @Version("1")
        async updatePackages(@Body() dto:BoostPackageUpdateDto){

            return await this.boostPackageServices.updatePackages(dto);
        }


        @Put("update-packages-type")
        @ModuleAccess("Manage Boost Package")
        @Version("1")
        async updatePackagesType(@Body("id") id:string,@Body("type") type:string){

            console.log("id",id);
            console.log("type",type);
            return await this.boostPackageServices.updatepackageType(id,type);
        }







}