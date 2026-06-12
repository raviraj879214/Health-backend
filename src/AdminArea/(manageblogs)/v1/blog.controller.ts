import { Body, Controller, Delete, Get, Inject, Param, Post,Headers, Query, Req, UseGuards, UseInterceptors, Version, Ip } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";
import { Blog_SERVICE_V1 } from "../constants/blog.constant";
import { BlogServices } from "./blog.services";
import { NoFilesInterceptor } from "@nestjs/platform-express";
import type { BlogRequest } from "../request/blog.request";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { UAParser } from "ua-parser-js";
import type { AuthRequest } from "src/common/decorators/auth-request.interface";






@Controller("/api/manage-blog")
@UseGuards(RolesGuard)
export class BlogController{

    constructor(@Inject(Blog_SERVICE_V1) private readonly blogService: BlogServices) {
    }


    @Post("create-blog")
    @Version("1")
    async createBlog(@Req() dto: BlogRequest) {

        const blogImage = dto.file;

        const blogImageUrl = (dto as any).fileName ?? null;
        
        const writerImageUrl =  (dto as any).writerFileName ?? null;
        const reviewerImageUrl = (dto as any).reviewerFileName ?? null;
        const ogImageUrl = (dto as any).ogFileName ?? null;


        console.log("ogImageUrl:", ogImageUrl);
        console.log("Blog Image:", blogImageUrl);
        console.log("Writer Image:", writerImageUrl);
        console.log("Reviewer Image:", reviewerImageUrl);

        const {
            title,
            content,
            readingMinutes,
            metaTitle,
            metaKeywords,
            metaDescription,
            se_structure,
            og_structure,
            writerName,
            reviewerName,
             ogUrl,
        ogType,
        publisher,
        category
        } = dto.body ?? {};

        console.log(dto.body);
    
        return await this.blogService.createBlog(dto.body.updateid,dto.body.title!,dto.body.content!,dto.body.readingMinutes!,dto.body.metaTitle!,dto.body.metaKeywords!,dto.body.metaDescription!,dto.body.se_structure!,dto.body.og_structure!,dto.body.writerName!,dto.body.reviewerName!,blogImageUrl,writerImageUrl,reviewerImageUrl,dto.body.ogUrl!,dto.body.ogType!,dto.body.publisher!,ogImageUrl,dto.body.category!);
    }
    

        @Get("get-blogs")
        // @ModuleAccess('Manage Blog')
        @Version("1")
        getBlog(@Query('page') page: string,@Query('limit') limit: string){
    
             const pageNumber = parseInt(page) || 1;
            const pageSize = parseInt(limit) || 10;
            return this.blogService.getBlogs(pageNumber,pageSize);
        }



    @Delete("delete-blog/:id")
    //@ModuleAccess('Manage Blog')
    @Version("1")
    deleteBlog(@Param('id') id: string, @Ip() ipAddress: string, @Headers('user-agent') userAgent: string, @Req() request: AuthRequest) {
        const userId = request.user?.sub;
        var uaInfo = (() => {
            var result = new UAParser(userAgent).getResult();
            return `${result.browser.name} ${result.browser.version} on ${result.os.name} ${result.os.version}`;
        })();
        return this.blogService.deleteBlog(Number(id), userId!, ipAddress, uaInfo);
    }


    @Get("get-blog/:id")
    @Version("1")
    async getBlogs(@Param("id") id:string){

        return await this.blogService.getBlogsById(id);
    }






}