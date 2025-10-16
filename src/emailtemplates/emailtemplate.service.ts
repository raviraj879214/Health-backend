import { Body, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateEmailModule } from "./dto/update-email-dto";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";




@Injectable()
export class EmailTemplateServics{

    //constructor initialisation
    constructor(private prisma: PrismaService , private readonly activityLogService: ActivityLogService) 
    {

    }





    async getEmailSubject(){

        const subject = await this.prisma.emailTemplate.findMany({
            select :{
                id : true,
                subject : true,
                body : true
            }
        });
        if(!subject){
            return {
                status : 404,
                message : "No Data Found",
            }
        }
        else{
             return {
                status : 200,
                message : "subject data fetched successfully",
                data : subject
             }
        }
    }



    async updateEmailTemplate(dto: UpdateEmailModule,userId,ipAddress,userAgent) {

        try {
            // Make sure to await the update
            const emailUpdate = await this.prisma.emailTemplate.update({
                where: { id: Number(dto.id) },
                data: { body: dto.body }
            });


            this.activityLogService.createLog({
                userId :  userId,
                action: 'Update',
                description: emailUpdate.subject +  ' Email Updated Successfully',
                entityType: '',
                entityId: 0,
                ipAddress : ipAddress,
                userAgent : userAgent,
            });
            

            return {
                status: 200,
                message: "Data updated successfully",
                data: emailUpdate // <-- this will now contain the updated record
            };
        } catch (error) {

            return {
                status: 404,
                message: `Email template with id  not found`
            };



        }
    }




    






} 