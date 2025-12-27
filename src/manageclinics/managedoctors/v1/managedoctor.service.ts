import { Injectable } from "@nestjs/common";
import { IManageDoctor } from "../interface/managedoctor.interface";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class ManageDoctorServices implements IManageDoctor{
    constructor(private readonly prisma:PrismaService){}



    async  getDoctorDetails(id: string) {
        
        const doctorDetails = await this.prisma.doctor.findFirst({
            where: {
                uuid: id
            }
        });


        return{
            status : 200,
            data : doctorDetails
        }

    }

     async getDoctorSurgeryImages(id: string) {
        const surgeryImages = await this.prisma.clinicSurgeryImage.findMany({
            where : {
                doctorUuid : id
            }
        });

        return{
            status : 200,
            data : surgeryImages
        }
    }

    async getDoctorsClinic(id: string) {
            const getDoctorsClinics = await this.prisma.clinicDoctor.findMany({
                where : {
                    doctorUuid : id
                },
                include:{
                    clinic : {
                    
                        include : {
                            country : true,
                            city : true,
                            clinicDoctorAddress : {
                                where :{
                                    doctorUuid : id
                                }
                            }
                        }
                    },
                }
            });

            const clinicuuids = getDoctorsClinics.map(item=> item.clinicUuid);


            const ClinicImages = await Promise.all(
                    clinicuuids.map(uuid =>
                        this.prisma.clinicImages.findFirst({
                        where: { clinicuuid: uuid },
                        orderBy: { createdAt: 'asc' } 
                        })
                    )
                 );



           

            return {
                status : 200,
                data : getDoctorsClinics,
                ClinicImages
            }

    }




}