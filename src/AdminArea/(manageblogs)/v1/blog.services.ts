import { Injectable } from "@nestjs/common";
import { IBlogService } from "../interface/blog.interface";
import { PrismaService } from "src/prisma/prisma.service";




@Injectable()
export class BlogServices implements IBlogService{

    constructor(private readonly prisma: PrismaService) {
    }


    async createBlog(title: string, content: string, tag: string, userId: number) {
        
    }










}