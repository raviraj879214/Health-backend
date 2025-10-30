import { Injectable } from "@nestjs/common";
import { ISpecialtyService } from "../interface/specialities.interace";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";
import { SpecialtyCreateDto } from "./dto/specialities.create";
import { SpecialtyUpdateDto } from "./dto/specialities.update";





@Injectable()
export class SpecialtyServices implements ISpecialtyService {

    constructor(private readonly prisma: PrismaService,private readonly activityLogService: ActivityLogService){

    }


   async createSpecialty(dto: SpecialtyCreateDto, userId: number, ipAddress: string, userAgent: string) {
        try {
            let specialtyTypeId: number; // define once

            // Case 1: If typeId is 0 => create new SpecialtyType
            if (Number(dto.typeId) === 0) {
            const existingType = await this.prisma.specialtyType.findFirst({
                where: { name: dto.specialtytypename },
            });

            if (existingType) {
                return {
                status: 409,
                message: "SpecialtyType already exists",
                };
            }

            const specialtyCreate = await this.prisma.specialtyType.create({
                data: { name: dto.specialtytypename ?? "" },
            });

            specialtyTypeId = specialtyCreate.id;
            } 
            // Case 2: Otherwise, use existing id
            else {
            specialtyTypeId = Number(dto.typeId);
            }

            // Check if Specialty already exists
            const specialtyExist = await this.prisma.specialty.findFirst({
            where: { name: dto.name },
            });

            if (specialtyExist) {
            return {
                status: 409,
                message: "Specialty already exists",
            };
            }

            // ✅ Create Specialty
            const datacreate = await this.prisma.specialty.create({
            data: {
                name: dto.name,
                typeId: specialtyTypeId,
                status: dto.status,
                description: dto.description,
            },
            });

            // ✅ Log activity
            await this.activityLogService.createLog({
            userId,
            action: "Create",
            description: `${dto.name} Specialty Created Successfully`,
            entityType: "Specialty",
            entityId: Number(datacreate.id),
            ipAddress,
            userAgent,
            });

            return { data: datacreate, message: "Specialty created successfully" };
        } catch (error) {
            return {
            message: error.message,
            status: error.status ?? 500,
            };
        }
        }




    async getAllSpecialty(page: number, limit: number) {

        const totalCount = await this.prisma.specialty.count();
        const data  = await this.prisma.specialty.findMany({
            include: {
                type: {
                    select : {
                        name : true
                    }
                }, 
            },
             skip: (page - 1) * limit, 
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return {
             data,
            totalCount
        }
    }





    async updateSpecialty(dto: SpecialtyUpdateDto,userId: number, ipAddress: string, userAgent: string) {

        if (!dto || !dto.id) {
        return { status: 400, message: "Invalid request: ID is required"  };
        }

        const dataupdate = await this.prisma.specialty.update({
            where :{
                id : Number(dto.id)
            },
            data :{
                name : dto.name,
                typeId : Number(dto.typeId),
                description : dto.description,
            }
        });


         await this.activityLogService.createLog({
                    userId: userId,
                    action: 'Update',
                    description: `${dataupdate.name} Speciality Updated Successfully`,
                    entityType: 'Speciality',
                    entityId: dataupdate.id,
                    ipAddress: ipAddress,
                    userAgent: userAgent,
                    });


        return{
            data : dataupdate,
            status : 200,
            message : "Specialty updated successfully"
        }
    }

    


    async deleteSpecialty(id: number, userId: number, ipAddress: string, userAgent: string) {
        try {
                const deletedBlog = await this.prisma.specialty.delete({
                    where: { id: id },
                });

               

                // Log the deletion activity
                await this.activityLogService.createLog({
                    userId: userId,
                    action: 'Delete',
                    description: `${deletedBlog.name} Speciality Deleted Successfully`,
                    entityType: 'Speciality',
                    entityId: deletedBlog.id,
                    ipAddress: ipAddress,
                    userAgent: userAgent,
                    });

                    return {
                    status: 200,
                    message: 'Speciality Deleted Successfully',
                };
        } 
        catch (error) 
        {
            // Prisma throws P2025 if record not found
            if (error.code === 'P2025') {
            return {
                status: 404,
                message: "Blog Doesn't Exist",
            };
            }

            // Re-throw other unexpected errors
            throw error;
        }
    }














}
