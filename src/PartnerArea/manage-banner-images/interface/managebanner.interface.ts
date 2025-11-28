import { ManageBannerImageCreateDto } from "../v1/dto/managebanner.update.dto";

export interface IManageBannerServices {
  getAllBannerImages(clinicuuid: string);

  createOrUpdateBanner(dto: ManageBannerImageCreateDto);

  deleteBanner(id:number);
}
