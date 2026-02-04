import { Injectable } from "@nestjs/common";
import { IManageSurgeries } from "../interface/managesurgeries.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ManageSurgeriesCreateDto } from "./dto/managesurgeries.create.dto";
import { FileService } from "src/common/middleware/file.service";
import { PackageVerifyStatus } from "src/common/enum/packageVerifyStatus";
import { DoctorVerifyStatus } from "src/common/enum/doctorVerifyStatus";



@Injectable()
export class ManageSurgeries implements IManageSurgeries{


    constructor(private readonly prisma:PrismaService,private readonly fileservice:FileService){}


    async getSurgeryImages(id:string) {



        const surgeriesdata = await this.prisma.clinicSurgeryImage.findMany({
            where :{
                clinicUuid : id,
            },
        });

        const doctorIds = surgeriesdata.map(x => x.doctorUuid).filter((id): id is string => !!id);
        const doctors = await this.prisma.doctor.findMany({where: {uuid: {in: doctorIds,},},});

        const treatmids = surgeriesdata.map(x => x.treatmentid).filter((id): id is string => !!id);
        const treatment = await this.prisma.treatment.findMany({where: {id: {in: treatmids,},},});

        const packageids = surgeriesdata.map(x => x.packageid).filter((id): id is string => !!id);
        const packages = await this.prisma.clinicPackage.findMany({where: {id: {in: packageids,},},});
        
        console.log("packages",packages);
        return {
            status : 200,
            data : surgeriesdata,
            doctors : doctors,
            treatment:treatment,
            packages:packages,
            message : "Clinic surgery images fetched successsfully"
        }

    }




    async addSurgeriesImages(dto: ManageSurgeriesCreateDto) {
         console.log("dto",dto);
        const insertsurgerie = await this.prisma.clinicSurgeryImage.create({
            data : {
                imageType : dto.type,
                imageUrl : dto.imageUrl,
                surgeryId : dto.surgeryId,
                clinicUuid : dto.clinicUuid,
                doctorUuid : dto.doctorUuid,
                treatmentid: dto.treatmentid,
                packageid : dto.packageid
            }
        });


        return { 
            status : 200,
            message : "Images uploaded successfully"
        }


    }




    async deleteSurgeriesImages(id: string) {

        //console.log("id",id);
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
                },
                DoctorVerify : DoctorVerifyStatus.VERIFIED
                
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



     async getPackages(clinicuuid: string) {

        const  doctorsdetaislname = await this.prisma.clinicPackage.findMany({
            where : {
               clinicId : clinicuuid,
               status : PackageVerifyStatus.VERIFIED
            },
            select:{
                title : true,
                id : true
            }
        });

        return {
            status : 200,
            data : doctorsdetaislname
        }


    }


}