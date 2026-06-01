import { Injectable } from "@nestjs/common";
import { IClinicDetails } from "../interface/clinicdetails.interface";
import { PrismaService } from "src/prisma/prisma.service";





@Injectable()
export class ClinicDetailServices implements IClinicDetails{
      constructor(private readonly prisma:PrismaService){}
    


      async getClinicList() {
        const data = await this.prisma.clinic.findMany({
            include : {
                clinicsSpecialty :{
                    include :{
                        specialty : true
                    }
                },
                clinics : {
                    include :{
                        specialization : true
                    }
                },
                clinicTreatments:{
                    include : {
                        treatment : true
                    }
                }
            }
        });


        return {
            data : data
        }
      }



      async updateSeoClinicDetails(metatitle: string, metakeyword: string, metadescription: string, slug: any,uuid:string) {
          
        const updateClinic = await this.prisma.clinic.update({
            where:{
                uuid : uuid
            },
            data:{
                metatitle : metatitle,
                metakeyword : metakeyword,
                metadescription : metadescription
            }
        });
        return {
            data : updateClinic
        }
      }




}