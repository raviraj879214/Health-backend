import { Controller, Get, Inject, Post, Query, Req, UseGuards, Version,Body, Put, Delete, Param } from "@nestjs/common";
import { MANAGESPECIALTIESCONSTANT } from "../constant/managespecialties.constant";
import { ManageSpecialtiesServices } from "./managespecialties.service";
import { RolesGuard } from "src/common/guards/roles.guards";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import type { AuthRequest } from "src/common/decorators/auth-request.interface";










@Controller("/api/manage-sub-specialties")
@UseGuards(RolesGuard)
export class ManageSpecialtyController{
    constructor(@Inject(MANAGESPECIALTIESCONSTANT)private readonly manageSpecialtyServices:ManageSpecialtiesServices){}



    @Get("get-sub-specialties")
    @ModuleAccess("Manage Specialty")
    @Version("1")
    async getManageSpecialties(@Query('page') page: string,@Query('limit') limit: string,@Req() request: AuthRequest){
        const userId = Number(request.user?.sub);
        const pageNumber = parseInt(page) || 0;
        const pageSize = parseInt(limit) || 0;
        
        return this.manageSpecialtyServices.getSpecilaties(pageNumber,pageSize,userId);
    }


        @Post("create-sub-specialties")
        @ModuleAccess("Manage Specialty")
        @Version("1")
        async createSpecialties(@Body() dto: { name: string; userid: number },@Req() request: AuthRequest) {

                const userId = Number(request.user?.sub);
                return await this.manageSpecialtyServices.createSpecialties(
                    dto.name,
                    userId
                );
        }


        @Put("update-sub-specialties")
        @ModuleAccess("Manage Specialty")
        @Version("1")
        async updateSpecialties(@Body() dto: { name: string; userid: number , id:string },@Req() request: AuthRequest) {

            const userId = Number(request.user?.sub);
                return await this.manageSpecialtyServices.updateSpecialties(
                    dto.id,
                    dto.name,
                    userId
                );
        }


         @Delete("delete-sub-specialties/:id")
        @ModuleAccess("Manage Specialty")
        @Version("1")
        async deleteSpecialties(@Param("id") id:string,@Req() request: AuthRequest) {

            const userId = Number(request.user?.sub);
            return await this.manageSpecialtyServices.deleteSpecialties(id,userId);
        }








}