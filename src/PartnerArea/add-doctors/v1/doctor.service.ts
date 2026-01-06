import { Injectable } from "@nestjs/common";
import { IDoctorServices } from "../interface/doctor.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { DoctorUpdateDto } from "./dto/doctor.update.dto";




@Injectable()
export class DoctorServices implements IDoctorServices{

    constructor(private readonly prisma:PrismaService){}


    async getDoctors(clinicuuid: string) {
    
                const assignments = await this.prisma.clinicDoctor.findMany({
                where: {
                    clinicUuid: clinicuuid,
                },
                });

          
                const doctorUuids = assignments.map((a) => a.doctorUuid);

             
            const assignedDoctors = await this.prisma.doctor.findMany({
                where: {
                    uuid: {
                    in: doctorUuids,
                    },
                },
             });








         return {
            status : 200,
            message : "fetch doctors successfully",
            data : assignedDoctors
         }
    }



     async getClinicDoctorList(clinicuuid: string) {

        const getData = await this.prisma.clinicDoctor.findMany({
            where :{
                clinicUuid : clinicuuid
            }
        });


        const doctorslistids = getData.map((a) => a.doctorUuid);


        return {}



    }


    

    async createUpdateDoctor(dto: DoctorUpdateDto) {

        console.log("existDoctor",dto.doctoruuid);

        if(dto.doctoruuid !== "null"){

             var existDoctor =await this.prisma.doctor.findUnique({
                where : {
                    uuid : dto.doctoruuid
                }
            });

            const doctorUpdate = await this.prisma.doctor.update({
                where :{
                    uuid : dto.doctoruuid
                },
                data :{
                    firstname : dto.firstname,
                    lastname : dto.lastname,
                    email: dto.email,
                    dob:dto.dob,
                    crm:dto.crm,
                    languages:dto.languages,
                    videurl:dto.videourl,
                    image : dto.image_url,
                    cpf : dto.cpf,
                    degree : dto.degree

                }
            });





            return {
                status : 200 ,
                message : "Doctor updated successfully",
                data : existDoctor
            }
        }
        else{

           const checkcrm = await this.prisma.doctor.findFirst({
                    where: {
                        crm: String(dto.crm || "")
                    }
            });


            if(checkcrm){
                
                return{
                    status : 401
                }
            }


            



             const doctorCreate = await this.prisma.doctor.create({
                data :{
                    firstname : dto.firstname,
                    lastname : dto.lastname,
                    email: dto.email,
                    dob:dto.dob,
                    crm:dto.crm,
                    languages:dto.languages,
                    videurl:dto.videourl,
                    clinicuuid : dto.clinicuuid,
                    image : dto.image_url,
                    cpf : dto.cpf,
                    degree : dto.degree
                }


            });

            

            await this.prisma.clinicDoctor.create({
                data : {
                    clinicUuid : dto.clinicuuid!,
                    doctorUuid : doctorCreate.uuid
                }
            });

             return {
                status : 201,
                message : "Doctor created successfully",
                data : doctorCreate
            }


        }
    }



    async  getDoctorDetails(doctoruuid: string) {
        const Doctordetails =await this.prisma.doctor.findFirst({
            where :{
                uuid : doctoruuid
            }
        });


        return {
            message : "Doctor details fetched successfully",
            data : Doctordetails,
            status : 200
        }
    }


    async getGlobalDoctorsList(clinicUuid:string){

        
        const getDoctorids = await this.prisma.clinicDoctor.findMany({
            where :{
                clinicUuid : clinicUuid
            }
        });


        const doctrorids = getDoctorids.map((item)=> item.doctorUuid);



        const getAllData = await this.prisma.doctor.findMany({
            where : {
                uuid :{
                    notIn :doctrorids
                }
            }
        });

        return {
            status : 200,
            data : getAllData
        }
    }


     async assignDoctorsClinic(dto: DoctorUpdateDto) {

                if (!dto.clinicuuid) {
                    throw new Error("clinicUuid is required");
                }

                if (!dto.doctoruuid) {
                     throw new Error("doctorUuid is required");
                }

                const created = await this.prisma.clinicDoctor.create({
                        data: {
                            clinicUuid: dto.clinicuuid,
                            doctorUuid: dto.doctoruuid,
                        },
                });

                return{
                        status : 201,
                        message : "Doctors assigned to clinic successfully"
                    }
                }

   

}