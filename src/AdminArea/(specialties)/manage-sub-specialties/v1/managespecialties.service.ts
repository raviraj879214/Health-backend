import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";
import { IManageSubSpecialties } from "../interface/IManageSpecialties";








@Injectable()
export class ManageSpecialtiesServices implements IManageSubSpecialties{

    constructor(private readonly prisma:PrismaService,private readonly activityLogService: ActivityLogService){}



    async getSpecilaties(page: number, limit: number, userid: number) {
        
        const totalCount = await this.prisma.specialty.count();
        const getData = await this.prisma.specialty.findMany({
           
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
        
        
        


        const checkexist= await this.prisma.specialty.findUnique({
            where:{
                name : name
            }
        });

        if(checkexist){
            return {
                status : 401,
                message : "Sub Specialty already exist"
            }
        }

        const createSpecialty = await this.prisma.specialty.create({
            data:{
                name : name
            }
        });


        const ipAddress= "0.0.0.0";
        const userAgent= "any browser";
        await this.activityLogService.createLog({
            userId : userid,
            action: "Create",
            description: `${createSpecialty.name} Sub Specialty Created Successfully`,
            entityType: "subspecialtyPages",
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

       
        const checkexist = await this.prisma.specialty.findFirst({
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
                message: "Sub Specialty already exist"
            };
        }

        const updateSpecialty = await this.prisma.specialty.update({
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
            description: `${updateSpecialty.name} Sub Specialty Updated Successfully`,
            entityType: "subspecialtyPages",
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
        
        const deleteSpecialties = await this.prisma.specialty.delete({
            where :{
                id:id
            }
        });
        

         const ipAddress= "0.0.0.0";
        const userAgent= "any browser";
         await this.activityLogService.createLog({
            userId : userId,
            action: "Delete",
            description: `${deleteSpecialties.name} Sub  Specialty Deleted Successfully`,
            entityType: "subspecialtyPages",
            entityId: Number(deleteSpecialties.id),
            ipAddress,
            userAgent,
        });

        return{
            status : 200,
            message : "Sub Specialty deleted successfully"
        }
    }





}