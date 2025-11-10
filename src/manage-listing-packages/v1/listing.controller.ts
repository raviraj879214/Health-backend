import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards, Version } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";
import { LISTING_SERVICE_V1 } from "../constant/listing.constant";
import { ListingService } from "./listing.service";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { CreateListingDto } from "./dto/create.listing.dto";
import { UpdateListingDto } from "./dto/update.listing.dto";






@Controller("/api/listing-package")
@UseGuards(RolesGuard)
export class ListingController {


    constructor(@Inject(LISTING_SERVICE_V1) private readonly listingService:ListingService){}



    @Post("/create")
    @Version("1")
    @ModuleAccess("Manage Package Listing")
    createListingPackages(@Body() dto: CreateListingDto){
        return this.listingService.createListing(dto);
    }


    @Put("/update")
    @Version("1")
    @ModuleAccess("Manage Package Listing")
    updateListingPackages(@Body() dto: UpdateListingDto){
        return this.listingService.updateListing(dto);
    }





    @Get("/get-all")
    @Version("1")
    @ModuleAccess("Manage Package Listing")
   async  getListing(@Query('page') page: string,@Query('limit') limit: string){
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;


        return await this.listingService.getListing(pageNumber,pageSize);
    }




    @Delete("/delete/:id")
    @Version("1")
    @ModuleAccess("Manage Package Listing")
    async deletePackageListing(@Param("id") id:number){

       return await this.listingService.deleteListing(Number(id));
    }


    @Put("/update-status")
    @Version("1")
    @ModuleAccess("Manage Package Listing")
    async updatepackageListingStatus(@Body() dto: UpdateListingDto){
            console.log("dto.id",dto.id);
            return await this.listingService.updatepackageStatus(dto);
    }














}