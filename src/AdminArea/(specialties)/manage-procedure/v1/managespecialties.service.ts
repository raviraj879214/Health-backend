import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";
import {  IManageProcedure } from "../interface/IManageSpecialties";








@Injectable()
export class ManageSpecialtiesServices implements IManageProcedure{

    constructor(private readonly prisma:PrismaService,private readonly activityLogService: ActivityLogService){}



    async getSpecilaties(page: number, limit: number, userid: number) {
        
        const totalCount = await this.prisma.procedure.count();
        const getData = await this.prisma.procedure.findMany({
           
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
        
        
        


        const checkexist= await this.prisma.procedure.findFirst({
            where:{
                name : name
            }
        });

        if(checkexist){
            return {
                status : 401,
                message : "Procedure already exist"
            }
        }

        const createSpecialty = await this.prisma.procedure.create({
            data:{
                name : name
            }
        });


        const ipAddress= "0.0.0.0";
        const userAgent= "any browser";
        await this.activityLogService.createLog({
            userId : userid,
            action: "Create",
            description: `${createSpecialty.name} Procedure Created Successfully`,
            entityType: "ProcedurePages",
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

       
        const checkexist = await this.prisma.procedure.findFirst({
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
                message: "Procedure already exist"
            };
        }

        const updateSpecialty = await this.prisma.procedure.update({
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
            description: `${updateSpecialty.name} Procedure Updated Successfully`,
            entityType: "ProcedurePages",
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
        
        const deleteSpecialties = await this.prisma.procedure.delete({
            where :{
                id:id
            }
        });
        

         const ipAddress= "0.0.0.0";
        const userAgent= "any browser";
         await this.activityLogService.createLog({
            userId : userId,
            action: "Delete",
            description: `${deleteSpecialties.name} Procedure Deleted Successfully`,
            entityType: "ProcedurePages",
            entityId: Number(deleteSpecialties.id),
            ipAddress,
            userAgent,
        });

        return{
            status : 200,
            message : "Procedure deleted successfully"
        }
    }





}