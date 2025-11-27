import { Injectable } from "@nestjs/common";
import { IManageSurgeries } from "../interface/managesurgeries.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ManageSurgeriesCreateDto } from "./dto/managesurgeries.create.dto";
import { FileService } from "src/common/middleware/file.service";



@Injectable()
export class ManageSurgeries implements IManageSurgeries{


    constructor(private readonly prisma:PrismaService,private readonly fileservice:FileService){}


    async getSurgeryImages() {

        const surgeriesdata = await this.prisma.clinicSurgeryImage.findMany();

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
                surgeryId : dto.surgeryId
            }
        });


        return { 
            status : 200,
            message : "Images uploaded successfully"
        }


    }




    async deleteSurgeriesImages(id: string) {

    const images = await this.prisma.clinicSurgeryImage.findMany({
        where: {
            surgeryId: id,
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
        where: { surgeryId: id },
    });

    return {
        status: 200,
        message: "Images deleted successfully",
        data: deletesurgeries,
    };
}




}