import { CreateListingDto } from "../v1/dto/create.listing.dto";
import { UpdateListingDto } from "../v1/dto/update.listing.dto";





export interface IListingService{

    createListing(dto: CreateListingDto);

    updateListing(dto : UpdateListingDto);

    getListing(page: number, limit: number);

    deleteListing(id : number);



    updatepackageStatus(dto:UpdateListingDto);




}