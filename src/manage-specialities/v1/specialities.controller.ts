import { Body, Controller, Inject, Ip, Post, UseGuards, Version ,Headers, Req, Get, Query, Put, Param, Delete } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";
import { SPECIALTY_SERVICE_V1 } from "../constant/specialities.constant";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { SpecialtyCreateDto } from "./dto/specialities.create";
import { SpecialtyServices } from "./specialities.service";
import type { AuthRequest } from "src/common/decorators/auth-request.interface";
import { UAParser } from "ua-parser-js";
import { SpecialtyUpdateDto } from "./dto/specialities.update";









@Controller("/api/specialties")
@UseGuards(RolesGuard)
export class SpecialtyController{

    constructor(@Inject(SPECIALTY_SERVICE_V1) private readonly specialtyService: SpecialtyServices) { }


    @Post("/create")
    @Version("1")
    @ModuleAccess('Manage Specialty')
    async createSpecialties(@Body() dto:SpecialtyCreateDto,@Ip() ipAddress: string , @Headers('user-agent') userAgent: string,@Req() request: AuthRequest) {

        const userId = request.user?.sub;
        var uaInfo = (() => { 
        var result = new UAParser(userAgent).getResult(); 
        return `${result.browser.name} ${result.browser.version} on ${result.os.name} ${result.os.version}`; })();


        return this.specialtyService.createSpecialty(dto,userId!,ipAddress,uaInfo);
    }



    @Get("/get-all")
    @Version("1")
    @ModuleAccess('Manage Specialty')
    async getAllSpecilaties( @Query('page') page: string,@Query('limit') limit: string){

       const pageNumber = parseInt(page) || 1;
       const pageSize = parseInt(limit) || 10;
        return this.specialtyService.getAllSpecialty(pageNumber,pageSize);
    }


    @Put('/update-specialties')
    @Version("1")
    @ModuleAccess('Manage Specialty')
    async updateSpecialties(@Body() dto: SpecialtyUpdateDto,@Ip() ipAddress: string , @Headers('user-agent') userAgent: string,@Req() request: AuthRequest){

        console.log("dto",dto);

         const userId = request.user?.sub;
            var uaInfo = (() => { 
            var result = new UAParser(userAgent).getResult(); 
            return `${result.browser.name} ${result.browser.version} on ${result.os.name} ${result.os.version}`; })();


        return this.specialtyService.updateSpecialty(dto,userId!,ipAddress,uaInfo);
    }


        @Delete("delete-specialties/:id")
        @ModuleAccess('Manage Blog')
        @Version("1")
        async deleteSpecialties(@Param('id') id: string,@Ip() ipAddress: string , @Headers('user-agent') userAgent: string,@Req() request: AuthRequest){

             const userId = request.user?.sub;
            var uaInfo = (() => { 
            var result = new UAParser(userAgent).getResult(); 
            return `${result.browser.name} ${result.browser.version} on ${result.os.name} ${result.os.version}`; })();

                return this.specialtyService.deleteSpecialty(Number(id),userId!,ipAddress,uaInfo);

        }










        

}