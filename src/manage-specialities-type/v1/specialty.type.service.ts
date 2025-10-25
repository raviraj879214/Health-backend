import { Injectable } from "@nestjs/common";
import { ISpecialtyTypeService } from "../interfae/specialty.type.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";





@Injectable()
export class SpecialtyTypeService implements ISpecialtyTypeService {


    constructor (private readonly prisma:PrismaService,private readonly activityLogService: ActivityLogService){

    }


    async getSpecialtyType(page: number, limit: number) {
        const totalCount = await this.prisma.specialtyType.count();

        const data =await this.prisma.specialtyType.findMany({
            skip: (page - 1) * limit, 
            take: limit,
        });
        return { data, totalCount }; 
    }






}