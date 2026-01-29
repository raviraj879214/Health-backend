import { Injectable } from "@nestjs/common";
import { IManageClinicService } from "../interface/manageclinic.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ManageClinicBusiness } from "./business/manageclinic.business";
import { ClinicGoogleMap, ManageClinicDto } from "./dto/manageclinic.update.dto";
import { EmailService } from "src/EmailServices/email.service";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { EmailTemplate } from "src/common/emailtemplate/email-template";





@Injectable()
export class ManageClinicService implements IManageClinicService{

    constructor(
        private readonly prisma : PrismaService,
        private readonly manageClinicBusiness : ManageClinicBusiness,
        private emailservice : EmailService,
        private readonly universalNotification:UniversalNotification
    ){}



    async get(id:string) {
        const data = await this.prisma.clinic.findMany({
            where : {
                clinicUserUuid : id
            }
        });
        return {
            status : 200,
            data : data
        }
    }

   async getClinicDetails(id:string) {
        if (!id) return { status: 400, message: "Invalid Clinic Id" };
        const data = await this.prisma.clinic.findUnique({
            where: { uuid: id }
        });
        return {
            status: 200,
            data
        };
  }




    async updateClinicName(dto: ManageClinicDto) {

        console.log("dto",dto);

        const clinic = await this.prisma.clinic.findUnique({
            where: { uuid: dto.clinicuuid },
        });

        if (!clinic) {
            return {
                status: 404,
                message: "Clinic not found"
            };
        }

        const updated = await this.prisma.clinic.update({
            where: { uuid: dto.clinicuuid },
            data: {
                name: dto.name,
                email: dto.email,
                address: dto.address,
                websiteurl: dto.websiteurl,
                cep: dto.cep,
                street: dto.street,
                complement: dto.complement,
                neighborhood: dto.neighborhood,
                citycep: dto.citycep,
                state: dto.state,

                addressnumber: dto.addressnumber,
                unidade : dto.unidade,
                estado : dto.estado,
                regiao : dto.regiao,
                ibge : dto.ibge,
                gia : dto.gia,
                ddd : dto.ddd,
                siafi : dto.siafi
            }
        });

        console.log("updates",clinic);


        return { status: 200, message: "Clinic name updated successfully", data: updated };
    }




    async updateClinicMap(dto: ClinicGoogleMap) {
    
        console.log("updateClinicMap",dto);

        const updateData = await this.prisma.clinic.update({
            where:{
                uuid : dto.uuid
            },
            data :{
                latitude : dto.latitude,
                longitude : dto.longitude
            }
        });
        
        console.log("updateData",updateData);

        return{
            status : true
        }
    }



    async pingAdmin(clinicmessage: string) {
        console.log("clinicmessage",clinicmessage);
        let payload: WebhookNotificationDto = {
            title: clinicmessage,
            area: "admin",
            message: ''
        }
        await this.universalNotification.HandleNotification(payload);

        const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
        const emailText = clinicmessage;
        const htmlContent = EmailTemplate.getTemplate(emailText);
        await this.emailservice.sendEmail(
                adminemail?.email!,
                `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `Request from clinic`,  
                "",            
                htmlContent  
        );



        return {success : true}

    }



}