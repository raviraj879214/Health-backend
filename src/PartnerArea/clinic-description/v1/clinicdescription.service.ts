import { Injectable } from "@nestjs/common";
import { IClinicDescription } from "../interface/clinicdescription.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ClinicDescritptionUpdateDto } from "./dto/clinicdescription.update.dto";






@Injectable()
export class ClinicDescriptionService implements IClinicDescription{

        constructor (
            private readonly prisma:PrismaService
        ){}

        async getClinicDescription(clinicuuid: string) {


            const data = await this.prisma.clinicDescription.findFirst({
                where : {
                    clinicuuid : clinicuuid
                }
            });
            return {
                status : 200,
                data : data,
                message : "Description fetched successfully"
            }
    
        }



        async createupdateClinicDescription(dto: ClinicDescritptionUpdateDto) {

            const exist = await this.prisma.clinicDescription.findFirst({
                where : {
                    clinicuuid : dto.clinicuuid
                }
            });

            if(exist){

                const updatedata = await this.prisma.clinicDescription.updateMany({
                    where : {
                        clinicuuid : dto.clinicuuid
                    },
                    data :{
                        briefDescription : dto.briefDescription,
                        fullDescription : dto.fullDescription
                    }
                })

                return {
                    status : 200,
                    message : "Description updated successfully"
                }

            }
            else{

              const createData =  await this.prisma.clinicDescription.create({
                    data :{
                        clinicuuid : dto.clinicuuid,
                        briefDescription : dto.briefDescription,
                        fullDescription : dto.fullDescription
                    }
                });


                return {
                    status : 201,
                    data : createData,
                    message : "Description created successfully"
                }




            }



        }
}