import { Injectable } from "@nestjs/common";
import { IManageClinicService } from "../interface/manageclinic.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ManageClinicBusiness } from "./business/manageclinic.business";
import { ClinicGoogleMap, ManageClinicDto } from "./dto/manageclinic.update.dto";





@Injectable()
export class ManageClinicService implements IManageClinicService{

    constructor(private readonly prisma : PrismaService,private readonly manageClinicBusiness : ManageClinicBusiness){}



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






}