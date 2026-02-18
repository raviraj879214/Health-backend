import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";
import {  IManageTreatment } from "../interface/IManageSpecialties";








@Injectable()
export class ManageSpecialtiesServices implements IManageTreatment{

    constructor(private readonly prisma:PrismaService,private readonly activityLogService: ActivityLogService){}



    async getSpecilaties(page: number, limit: number, userid: number) {
        
        const totalCount = await this.prisma.treatment.count();
        const getData = await this.prisma.treatment.findMany({
           
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
        
        
        


        const checkexist= await this.prisma.treatment.findUnique({
            where:{
                name : name
            }
        });

        if(checkexist){
            return {
                status : 401,
                message : "Treatment already exist"
            }
        }

        const createSpecialty = await this.prisma.treatment.create({
            data:{
                name : name
            }
        });


        const ipAddress= "0.0.0.0";
        const userAgent= "any browser";
        await this.activityLogService.createLog({
            userId : userid,
            action: "Create",
            description: `${createSpecialty.name} Treatment Created Successfully`,
            entityType: "treatmentPages",
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

       
        const checkexist = await this.prisma.treatment.findFirst({
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
                message: "Treatment already exist"
            };
        }

        const updateSpecialty = await this.prisma.treatment.update({
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
            description: `${updateSpecialty.name} Treatment Updated Successfully`,
            entityType: "treatmentPages",
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
        
        const deleteSpecialties = await this.prisma.treatment.delete({
            where :{
                id:id
            }
        });
        

         const ipAddress= "0.0.0.0";
        const userAgent= "any browser";
         await this.activityLogService.createLog({
            userId : userId,
            action: "Delete",
            description: `${deleteSpecialties.name} Treatment Deleted Successfully`,
            entityType: "treatmentPages",
            entityId: Number(deleteSpecialties.id),
            ipAddress,
            userAgent,
        });

        return{
            status : 200,
            message : "Treatment deleted successfully"
        }
    }





}