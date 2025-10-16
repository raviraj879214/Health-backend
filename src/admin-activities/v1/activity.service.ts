import { Injectable } from "@nestjs/common";
import { IActivityService } from "../interface/activity.interface";
import { PrismaService } from "src/prisma/prisma.service";




@Injectable()
export class ActivityService  implements IActivityService {

    constructor (private readonly prisma : PrismaService)
    {
    }


    async getUserList(page: number, limit: number,userId: number, ipAddress: string, userAgent: string) {

         const totalCount = await this.prisma.user.count();

        const users = await this.prisma.user.findMany({
         
        skip: (page - 1) * limit, 
        take: limit,
        include:{
          role:{
            select:{
              name :true
            }
          }
        }
        });

      return { users, totalCount }; // send roles + total count
    }



    async getAdminActivity(userId : number) {
        
        return this.prisma.activityLog.findMany({
            where:{
                userId : userId
            },
            orderBy: { createdAt: "desc" },
        });
        
    }













}