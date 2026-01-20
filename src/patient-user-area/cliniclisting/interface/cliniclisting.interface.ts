import { PostQueryCreateDto } from "../v1/dto/cliniclisting.create.dto";
import { ClinicListCreateDto } from "../v1/dto/cliniclisting.update.dto";



export interface IClinicListing{



    getClinicList(dto:ClinicListCreateDto);
    getClinicDetails(clinicId:string);
    getGoogleReviews(clinicId:string);

    postQuery(dto:PostQueryCreateDto);



}