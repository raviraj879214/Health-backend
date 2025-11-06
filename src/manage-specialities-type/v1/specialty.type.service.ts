import { BadRequestException, Injectable } from "@nestjs/common";
import { ISpecialtyTypeService } from "../interfae/specialty.type.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";
import { SpecialtyCreateDto } from "./dto/specialty-create.dto";
import { SpecialtyTypeBusiness } from "./business/SpecialtyBusiness";
import { SpecialtyUpdateDto } from "./dto/specialty-update.dto";





@Injectable()
export class SpecialtyTypeService implements ISpecialtyTypeService {


    constructor (private readonly prisma:PrismaService,private readonly activityLogService: ActivityLogService , private readonly business: SpecialtyTypeBusiness){

    }


   async getSpecialtyType(page: number, limit: number) {
        // If page or limit is 0 → return all records
        if (!page || !limit || page === 0 || limit === 0) {
            const data = await this.prisma.specialtyType.findMany({
            orderBy: { createdAt: "asc" },
            });

            return {
            data,
            totalCount: data.length,
            message: "All specialty types fetched successfully",
            };
        }

        // Normal pagination
        const totalCount = await this.prisma.specialtyType.count();

        const data = await this.prisma.specialtyType.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "asc" },
        });

        return {
            data,
            totalCount,
            message: "Specialty types fetched successfully",
            page,
            limit,
        };
        }


    async createSpecilatyName(dto: SpecialtyCreateDto) {

        this.business.validateName(dto.name);
        this.business.validateLength(dto.name);
        const exist = await this.prisma.specialtyType.findFirst({where: {name: dto.name.trim(),},});
        this.business.validateSameName(dto.name,exist);

        const createSpecialty = await this.prisma.specialtyType.create({
            data :{
                name : dto.name
            }
        });
        return {
            status : 201,
            message : "Specialty created successfully",
            data : createSpecialty
        }
    }


    


    async updateSpecialtyName(dto: SpecialtyUpdateDto) {

    const updated = await this.prisma.specialtyType.update({
        where: { id: Number(dto.id) },
        data: {
        name: dto.name,
        },
    });

    
    return {
        message: "Specialty updated successfully",
        data: updated,
    };
}



   async deleteSpecialtyName(id: number) {
            try {
                const deleted = await this.prisma.specialtyType.delete({
                where: {
                    id: Number(id),
                },
                });

                return {
                status: true,
                message: "Specialty deleted successfully",
                data: deleted,
                };
            } catch (error) {
                return {
                status: false,
                message: "Failed to delete specialty . Record may not exist.",
                error: error.message,
                };
            }
            }






}