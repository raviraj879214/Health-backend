import { Injectable } from "@nestjs/common";
import { IFaq } from "../interface/faq.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateFaqDto } from "./dto/createFaqDto";
import { UpdateFaqDto } from "./dto/updateFaqDto";






@Injectable()
export class FaqServices implements IFaq{
    constructor(private readonly prisma:PrismaService){}


    async getAll() {
        const Data = await this.prisma.faqs.findMany({
            orderBy : {
                sort_order : "asc"
            }
                
            
        });


        return{
            data : Data
        }

    }


    async createFaq(dto:CreateFaqDto,userId:number) {
        const createData = await this.prisma.faqs.create({
            data:{
                question : dto.question,
                answer : dto.answer
            }
        });
        return {
            data : createData
        }
    }



    async updateFaq(dto:UpdateFaqDto,userId:number) {
        const createData = await this.prisma.faqs.update({
            where:{id : dto.id},
            data:{
                question : dto.question,
                answer : dto.answer
            }
        });


        return {
            data : createData
        }
    }

    
   async deleteFaq(id: string, userId: number) {

    await this.prisma.faqs.delete({
        where: { id }
    });

    const faqs = await this.prisma.faqs.findMany({
        orderBy: {
            sort_order: "asc"
        }
    });

    return {
        data: faqs
    };
}


async updatePosition(position: { id: string; position: number }[]) {

  console.log("positions", position);

  await Promise.all(
    position.map((item) =>
      this.prisma.faqs.update({
        where: {
          id: item.id
        },
        data: {
          sort_order: item.position
        }
      })
    )
  );

  return { message: "Sorting updated successfully" };
}










}


