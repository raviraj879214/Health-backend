import { CreateFaqDto } from "../v1/dto/createFaqDto";
import { UpdateFaqDto } from "../v1/dto/updateFaqDto";

export interface IFaq{

    getAll();


    createFaq(dto:CreateFaqDto,userId:number);


    createFaq(dto:UpdateFaqDto,userId:number);

    deleteFaq(id:string,userId:number);


    updatePosition(position : []);

    
}