import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { PackageStepSixServices } from "./packagestepsix.service";
import { SavePackageFieldsDto } from "./dto/packagestepsix.update.dto";
import { PACKAGE_STEP_SIX_CONSTANT } from "../constant/packagestepsix.constant";




@Controller("/api/manage-package-custom")
export class PackageStepSixController {
    constructor(@Inject(PACKAGE_STEP_SIX_CONSTANT) private readonly managePackageSixServicdes:PackageStepSixServices){}


    @Get('definitions')
    getDefinitions() {
        return this.managePackageSixServicdes.getFieldDefinitions();

    }


        @Get(':packageId')
        getPackageFields(@Param('packageId') packageId: string) {
            return this.managePackageSixServicdes.getPackageFields(packageId);
        }

        @Post()
        savePackageFields(@Body() dto: SavePackageFieldsDto) {
            return this.managePackageSixServicdes.savePackageFields(dto);
        }

        





}