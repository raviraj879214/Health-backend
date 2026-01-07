import { Injectable } from "@nestjs/common";
import { IManageClinicService } from "../interface/manageclinic.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ManageClinicBusiness } from "./business/manageclinic.business";
import { ManageClinicDto } from "./dto/manageclinic.update.dto";





@Injectable()
export class ManageClinicService implements IManageClinicService{

    constructor(
        private readonly prisma : PrismaService,
        private readonly manageClinicBusiness : ManageClinicBusiness
    ){}



    async get(id) {
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

   async getClinicDetails(id) {
        if (!id) return { status: 400, message: "Invalid Clinic Id" };
        const data = await this.prisma.clinic.findFirst({
            where: { uuid: id },
            include:{
                country : true,
                city : true
            }
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
                email : dto.email,
                address : dto.address,
                phone : dto.phone,
                websiteurl : dto.websiteurl
                

             }
        });

            return { status: 200, message : "Clinic name updated successfully" , data: updated };
        }





}