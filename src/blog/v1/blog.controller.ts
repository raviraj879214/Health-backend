import { Body, Controller, Ip, Post, Req , Headers, Inject, Version, UseGuards, Put, Delete, Param, Query, Get } from "@nestjs/common";
import { CreatedBlog } from "./dto/create.blog";
import type { AuthRequest } from "src/common/decorators/auth-request.interface";
import { UAParser } from "ua-parser-js";
import { Blog_SERVICE_V1 } from "../constants/blog.constant";
import { BlogServices } from "./blog.service";
import { RolesGuard } from "src/common/guards/roles.guards";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { UpdatedBlog } from "./dto/update.blog";
import type { BlogRequest } from "../request/IBlogRequest";





@Controller("/api/blog")
@UseGuards(RolesGuard)
export class BlogController{

    constructor(@Inject(Blog_SERVICE_V1)private readonly blogService  : BlogServices)
    {
        

    }





    @Post("create-blog")
    @ModuleAccess('Manage Blog')
    @Version("1")
    createBlog(@Req() requestbody : BlogRequest, @Ip() ipAddress: string , @Headers('user-agent') userAgent: string,@Req() request: AuthRequest)
    {

    
        console.log("imagePath");

        const file = requestbody.file;
        const image_url = file ? `${file.filename}` : null;
        console.log("imagePath",image_url);
        
        const { title = '', content = '',tagid ='' } = requestbody.body ?? {};

        const dto: CreatedBlog = {title,content,...(image_url && { image_url }),tagid};


        const userId = request.user?.sub;
        var uaInfo = (() => { 
        var result = new UAParser(userAgent).getResult(); 
        return `${result.browser.name} ${result.browser.version} on ${result.os.name} ${result.os.version}`; })();


        return this.blogService.createBlog(dto,userId!,ipAddress,uaInfo);
    }


    @Put("update-blog")
    @ModuleAccess('Manage Blog')
    @Version("1")
    updateBlog(@Req() requestbody : BlogRequest, @Ip() ipAddress: string , @Headers('user-agent') userAgent: string,@Req() request: AuthRequest){

    
        const file = requestbody.file;
        const image_url = file ? `${file.filename}` : null;
        console.log("imagePath",image_url);

        const {id = '', title = '', content = '',tagid ='' } = requestbody.body ?? {};

        const dto: UpdatedBlog = {id,title,content,...(image_url && { image_url }),tagid};


        console.log('id:', id);
        console.log('title:', title);
        console.log('content:', content);

        const userId = request.user?.sub;
        var uaInfo = (() => { 
        var result = new UAParser(userAgent).getResult(); 
        return `${result.browser.name} ${result.browser.version} on ${result.os.name} ${result.os.version}`; })();

       

        return this.blogService.updateBlog(dto,userId!,ipAddress,uaInfo);
    }





    @Delete("delete-blog/:id")
    @ModuleAccess('Manage Blog')
    @Version("1")
    deleteBlog(@Param('id') id: string,@Ip() ipAddress: string , @Headers('user-agent') userAgent: string,@Req() request: AuthRequest){
        const userId = request.user?.sub;
        var uaInfo = (() => { 
        var result = new UAParser(userAgent).getResult(); 
        return `${result.browser.name} ${result.browser.version} on ${result.os.name} ${result.os.version}`; })();



        return this.blogService.deleteBlog(Number(id),userId!,ipAddress,uaInfo);
    }


    @Get("get-blogs")
    @ModuleAccess('Manage Blog')
    @Version("1")
    getBlog(@Query('page') page: string,@Query('limit') limit: string){

         const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        return this.blogService.getBlogs(pageNumber,pageSize);
    }












}