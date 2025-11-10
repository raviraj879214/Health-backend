import { Controller, Get, Inject, Query, UseGuards, Version } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";
import { PURCHASED_PACKAGE_SERVICE_V1 } from "../constant/purchasedpackage.constant";
import { PurchasedPackagesService } from "./purchasedpackages.service";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";



@Controller("/api/manage-purchased-packages")
@UseGuards(RolesGuard)
export class PurchasedPackagesController{

    constructor(
        @Inject(PURCHASED_PACKAGE_SERVICE_V1)private readonly purchasedpackagesServices: PurchasedPackagesService
    ){}


    @Get("/get-purchased-packages")
    @Version("1")
    @ModuleAccess("Manage Purchased Package")
    async getPurchasedPackages(@Query('page') page: string,@Query('limit') limit: string){

        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;


        return await this.purchasedpackagesServices.getPurchasedPackages(pageNumber,pageSize);
    }









}