import { Injectable } from "@nestjs/common";
import { IAccreditationService } from "../interface/accreditation.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { AccreditationsCreateDto } from "./dto/accreditation.update.dto";




@Injectable()
export class AccreditationService implements IAccreditationService{

    constructor(private readonly prisma:PrismaService){}


    async getAllAccreditation() {
        const allData = await this.prisma.accreditation.findMany({
            orderBy: { name: 'asc' } // optional: order alphabetically
        });

        return {
            status: 200,
            data: allData,
            message: "Accreditations fetched successfully"
        };
    }



    async getSelectedAccreditation(clinicuuid: string) {

        const allSelectedData = await this.prisma.clinicAccreditation.findMany({
            where :{
                clinicuuid : clinicuuid
            },
            include :{
                accreditation : true
            }
        });

        return {
             status : 200,
             data : allSelectedData,
             message : "Accreditations fetched successfully"
        }
    }


    async createSelectedAccreditations(dto: AccreditationsCreateDto) {
        

        const datacreate  =await this.prisma.clinicAccreditation.create({
            data : {
                accreditationId : Number(dto.accreditationId),
                clinicuuid :  dto.clinicuuid
            }
        });

        return {
             data : datacreate,
             status : 200,
             message : "Accreditations created succesfully"
        }
    }


    async deleteAccreditation(id: number) {


        const deleteaccre = await this.prisma.clinicAccreditation.delete({
            where :{
                id : Number(id)
            }
        });

        return {
            status : 200,
            message : "Accreditation deleted successfully"
        }
    }









}