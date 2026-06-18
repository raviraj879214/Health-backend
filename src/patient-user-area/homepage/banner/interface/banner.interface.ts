import { BannerCreateClinicDto } from "../v1/dto/banner.create.dto";
import { SearchClinicDto } from "../v1/dto/SearchClinicDto .dto";






export interface IHomePageBanner{

      getSpecialization(limit:number);
      getSpecialty();
      getTreatmetnt(isFeatured?:string);
      getPlaces();
      getTopRatedClinicListing(dto:BannerCreateClinicDto);
      getPopularClinicListing(dto:BannerCreateClinicDto);
      getPackages();
      getGoogleReviews(placesid:string);
      getGooglePlaces(placesid:string);
      getFaqs();

      clinicboostcronjob();

      updatePaymentAdditionalServices(id:string);


      getSeoPageContent(slug:string);

      getSeoPageSlug();


      getRedirects();


       //blogs
       getBlogs();
       getBlogDetails(slug:string);


       getClinicBySearch(dto:SearchClinicDto);


}