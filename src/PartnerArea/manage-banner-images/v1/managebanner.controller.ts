import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
  Version,
} from "@nestjs/common";
import { MANAGE_BANNER_SERVICES } from "../constant/managebanner.constant";
import { ManageBannerService } from "./managebanner.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import type { ManageBannerRequest } from "../request/IManageBannerrequest";
import { ManageBannerImageCreateDto } from "./dto/managebanner.update.dto";

@Controller("/api/manage-clinic-banner")
export class ManageBannerController {
  constructor(
    @Inject(MANAGE_BANNER_SERVICES)
    private readonly managebannerservice: ManageBannerService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("/get-all-images/:clinicuuid")
  @Version("1")
  async getAllBannerImages(@Param("clinicuuid") clinicuuid: string) {
    return await this.managebannerservice.getAllBannerImages(clinicuuid);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/insert-banner-images")
  @Version("1")
  async createOrUpdateBanner(@Req() requestbody: ManageBannerRequest) {
    const file = requestbody.file;
    const image_url = file ? `${file.filename}` : null;

    const { clinicuuid = "", sortbanner } = requestbody.body ?? {};

    const dto: ManageBannerImageCreateDto = {
      images: image_url ?? undefined,
      clinicUuid: clinicuuid,
      type: "banner",
      sort: String(sortbanner),
    };

    return this.managebannerservice.createOrUpdateBanner(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/delete-banner-images/:id")
  @Version("1")
  async deleteImageBanner(@Param("id") id:number){

    console.log("delete id",id);


    return this.managebannerservice.deleteBanner(id);

  }










}
