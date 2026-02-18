import { Injectable } from "@nestjs/common";
import { IManageSpecialties } from "../interface/IManageSpecialties";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";







@Injectable()
export class ManageSpecialtiesServices implements IManageSpecialties{

    constructor(private readonly prisma:PrismaService,private readonly activityLogService: ActivityLogService){}



    async getSpecilaties(page: number, limit: number, userid: number) {
        
        const totalCount = await this.prisma.specialization.count();
        const getData = await this.prisma.specialization.findMany({
           
            orderBy:{
                createdAt : 'desc'
            },
             ...((page > 0 && limit > 0) &&{
                    skip: (page - 1) * limit,
                    take: limit,
                })
    
        });

         return {
            status : 200,
            data : getData,
             totalCount
        }
    }


    async createSpecialties(name: string, userid: number) {
        
        
        


        const checkexist= await this.prisma.specialization.findUnique({
            where:{
                name : name
            }
        });

        if(checkexist){
            return {
                status : 401,
                message : "Specialty already exist"
            }
        }

        const createSpecialty = await this.prisma.specialization.create({
            data:{
                name : name
            }
        });


        const ipAddress= "0.0.0.0";
        const userAgent= "any browser";
        await this.activityLogService.createLog({
            userId : userid,
            action: "Create",
            description: `${createSpecialty.name} Specialty Created Successfully`,
            entityType: "specialtyPages",
            entityId: Number(createSpecialty.id),
            ipAddress,
            userAgent,
        });


       

        return {
            status : 200,
            data : createSpecialty
        }

    }


    async updateSpecialties(id: string, name: string, userid: number) {

       
        const checkexist = await this.prisma.specialization.findFirst({
            where: {
                name: name,
                NOT: {
                    id: id
                }
            }
        });

        if (checkexist) {
            return {
                status: 401,
                message: "Specialty already exist"
            };
        }

        const updateSpecialty = await this.prisma.specialization.update({
            where: {
                id: id
            },
            data: {
                name: name
            }
        });


         const ipAddress= "0.0.0.0";
        const userAgent= "any browser";
         await this.activityLogService.createLog({
            userId : userid,
            action: "Update",
            description: `${updateSpecialty.name} Specialty Updated Successfully`,
            entityType: "specialtyPages",
            entityId: Number(updateSpecialty.id),
            ipAddress,
            userAgent,
        });

        return {
            status: 200,
            data: updateSpecialty
        };
    }



    async deleteSpecialties(id: string,userId:number) {
        
        const deleteSpecialties = await this.prisma.specialization.delete({
            where :{
                id:id
            }
        });
        

         const ipAddress= "0.0.0.0";
        const userAgent= "any browser";
         await this.activityLogService.createLog({
            userId : userId,
            action: "Delete",
            description: `${deleteSpecialties.name} Specialty Deleted Successfully`,
            entityType: "specialtyPages",
            entityId: Number(deleteSpecialties.id),
            ipAddress,
            userAgent,
        });

        return{
            status : 200,
            message : "Specialty deleted successfully"
        }
    }





}