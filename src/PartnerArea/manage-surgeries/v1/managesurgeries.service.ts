import { Injectable } from "@nestjs/common";
import { IManageSurgeries } from "../interface/managesurgeries.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ManageSurgeriesCreateDto } from "./dto/managesurgeries.create.dto";
import { FileService } from "src/common/middleware/file.service";



@Injectable()
export class ManageSurgeries implements IManageSurgeries{


    constructor(private readonly prisma:PrismaService,private readonly fileservice:FileService){}


    async getSurgeryImages(id:string) {



        const surgeriesdata = await this.prisma.clinicSurgeryImage.findMany({
            where :{
                clinicUuid : id
            }
        });

        console.log("surgeriesdata",surgeriesdata);

        return {
            status : 200,
            data : surgeriesdata,
            message : "Clinic surgery images fetched successsfully"
        }

    }

    async addSurgeriesImages(dto: ManageSurgeriesCreateDto) {

        const insertsurgerie = await this.prisma.clinicSurgeryImage.create({
            data : {
                imageType : dto.type,
                imageUrl : dto.imageUrl,
                surgeryId : dto.surgeryId,
                clinicUuid : dto.clinicUuid,
                doctorUuid : dto.doctorUuid,
                treatmentid: dto.treatmentid
            }
        });


        return { 
            status : 200,
            message : "Images uploaded successfully"
        }


    }




    async deleteSurgeriesImages(id: string) {

        console.log("id",id);
    const images = await this.prisma.clinicSurgeryImage.findMany({
        where: {
            id: id,
        },
        select: { imageUrl: true }, // or filename if that's what you store
    });

    if (images.length === 0) {
        return {
            status: 404,
            message: "No images found for this surgery",
            data: [],
        };
    }

    
    for (const img of images) {
        await this.fileservice.deleteImage(img.imageUrl!,"/surgery/beforeandafter");
    }


    const deletesurgeries = await this.prisma.clinicSurgeryImage.deleteMany({
        where: { id: id },
    });

    return {
        status: 200,
        message: "Images deleted successfully",
        data: deletesurgeries,
    };
}



    async getTreatments() {
        const getData = await this.prisma.treatment.findMany({});

      

        return {
            status : 200,
            data : getData
        }
    }


    async getDoctors(clinicuuid: string) {

        const getdoctorsiid = await this.prisma.clinicDoctor.findMany({
            where : {
                clinicUuid : clinicuuid
            }
        });

        const idsarray = getdoctorsiid.map((data)=> data.doctorUuid);

        const  doctorsdetaislname = await this.prisma.doctor.findMany({
            where : {
                uuid : {
                    in : idsarray
                }
            },
            select:{
                firstname : true,
                lastname : true,
                uuid : true
            }
        });

        return {
            status : 200,
            data : doctorsdetaislname
        }


    }



}