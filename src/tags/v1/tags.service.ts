import { PrismaService } from "src/prisma/prisma.service";
import { ITagsServices } from "../interface/tags.interface";
import { Injectable } from "@nestjs/common";





@Injectable()
export class TagsService implements ITagsServices{

    constructor(private readonly prisma: PrismaService)
    {

    }

    async getTags() {
        
        try {
            const  tagslist= await this.prisma.tag.findMany({});

        return {
            message : "tags fetched successfully",
            status : 200,
            data : tagslist
        }
        
        } catch (error) {
            return {
                status : 500,
                 message : error.message
            }    
        }
    }









}