import { Injectable } from "@nestjs/common";
import { IDoctorDescriptionService } from "../interface/doctordescription.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { DoctorDescriptionUpdateDto } from "./dto/doctordescription.update.dto";



@Injectable()
export class DoctorDescriptionService implements IDoctorDescriptionService{

    constructor(private readonly prisma:PrismaService){}


    async getDescription(doctoruuid: string) {
        
        const getDescription = await this.prisma.doctor.findFirst({
            where :{
                uuid : doctoruuid
            }
        });

        return {
            status : 200,
            message : "",
            data : getDescription
        }
    }

    async updatedescription(dto: DoctorDescriptionUpdateDto) {

        const updateData = await this.prisma.doctor.update({
            where :{
                uuid : dto.doctoruuid
            },
            data : {
                fullDescription : dto.fulldescription,
                briefDescription : dto.biefdescription
            }
        });

        
        return {
            status : 200,
            message : "Updated successfully"
        }
    }









}