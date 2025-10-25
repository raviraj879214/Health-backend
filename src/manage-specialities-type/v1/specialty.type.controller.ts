import { Controller, Get, Inject, Query, UseGuards, Version } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";
import { SpecialtyTypeService } from "./specialty.type.service";
import { SPECIALTY_TYPE_SERVICE_V1 } from "../constant/specialty.type.constant";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";





@Controller("/api/specialties-type")
@UseGuards(RolesGuard)
export class SpecialtyTypeController{


    constructor(@Inject(SPECIALTY_TYPE_SERVICE_V1)private readonly specialtytypeService  : SpecialtyTypeService){
    }



     @Get("/get-all")
      @Version("1")
      // @ModuleAccess('Manage Specialty Type')
      findAll( @Query('page') page: string,@Query('limit') limit: string) {
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;

        return this.specialtytypeService.getSpecialtyType(pageNumber,pageSize);
      }

      













}