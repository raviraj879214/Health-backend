import { Injectable } from "@nestjs/common";
import { IManageBannerServices } from "../interface/managebanner.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { FileService } from "src/common/middleware/file.service";
import { ManageBannerImageCreateDto } from "./dto/managebanner.update.dto";

@Injectable()
export class ManageBannerService implements IManageBannerServices {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileservice: FileService
  ) {}

  // 🔹 GET ALL IMAGES
  async getAllBannerImages(clinicuuid: string) {
    const allData = await this.prisma.clinicImages.findMany({
      where: { clinicuuid, type: "banner" },
      orderBy: { sort: "asc" },
    });

    return {
      status: 200,
      data: allData,
      message: "Banner images fetched successfully",
    };
  }

  // 🔹 CREATE OR UPDATE IMAGE BASED ON SORT
  async createOrUpdateBanner(dto: ManageBannerImageCreateDto) {
    // ✔ Check if banner exists for clinicUuid + sort
    const existing = await this.prisma.clinicImages.findFirst({
      where: {
        clinicuuid: dto.clinicUuid,
        type: "banner",
        sort: dto.sort,
      },
    });

    // ===============================
    //  UPDATE (IF EXISTS)
    // ===============================
    if (existing) {
      // ✔ Delete old file from server
      if (existing.Images) {
        this.fileservice.deleteImage(existing.Images, "clinic/banner");
      }

      const updated = await this.prisma.clinicImages.update({
        where: { id: existing.id },
        data: {
          Images: dto.images,
          sort: dto.sort,
        },
      });

      return {
        status: 200,
        message: "Banner updated successfully",
        data: updated,
      };
    }

    // ===============================
    //  CREATE (IF NOT EXISTS)
    // ===============================
    const created = await this.prisma.clinicImages.create({
      data: {
        clinicuuid: dto.clinicUuid,
        type: "banner",
        Images: dto.images,
        sort: dto.sort,
      },
    });

    return {
      status: 200,
      message: "Banner created successfully",
      data: created,
    };
  }

  async deleteBanner(id: number) {

    console.log(typeof(id));
    const exist = await this.prisma.clinicImages.findFirst({
        where : {
            id : Number(id)
        }
    });

    if(exist){
        this.fileservice.deleteImage(exist.Images!,"clinic/banner");

        await this.prisma.clinicImages.delete({
            where : {
                id : Number(id)
            }
        });

        return { 
            status : 200,
            data : exist,
            message : "Image deleted successfully"

        }


    }
    else{
        return {
            status : 404,
            message : "image not found"
        }
    }



  }










}
