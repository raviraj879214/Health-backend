import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards, Version } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";
import { SpecialtyTypeService } from "./specialty.type.service";
import { SPECIALTY_TYPE_SERVICE_V1 } from "../constant/specialty.type.constant";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { SpecialtyCreateDto } from "./dto/specialty-create.dto";
import { version } from "os";
import { SpecialtyUpdateDto } from "./dto/specialty-update.dto";





@Controller("/api/specialties-type")
@UseGuards(RolesGuard)
export class SpecialtyTypeController{


    constructor(@Inject(SPECIALTY_TYPE_SERVICE_V1)private readonly specialtytypeService  : SpecialtyTypeService){
    }



     @Get("/get-all")
      @Version("1")
      @ModuleAccess('Manage Specialty')
      findAll( @Query('page') page: string,@Query('limit') limit: string) {
        const pageNumber = parseInt(page) || 0;
        const pageSize = parseInt(limit) || 0;

        console.log("page",page,"limit",limit);

        return this.specialtytypeService.getSpecialtyType(pageNumber,pageSize);
      }




      @Post("create-name")
       @Version("1")
       @ModuleAccess('Manage Specialty')
      createName(@Body() dto:SpecialtyCreateDto){
         console.log(dto);
         return this.specialtytypeService.createSpecilatyName(dto);

      }
      

      @Put("update-name")
      @Version("1")
      @ModuleAccess('Manage Specialty')
      updateName(@Body() dto:SpecialtyUpdateDto){

        console.log("id",dto.id);

         return this.specialtytypeService.updateSpecialtyName(dto);
      }



      @Delete("delete-name/:id")
      @Version("1")
      @ModuleAccess('Manage Specialty')
      deleteName(@Param("id") id :number){
          console.log("id",id);

           return this.specialtytypeService.deleteSpecialtyName(id);

      }












}