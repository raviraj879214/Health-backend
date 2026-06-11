import { Body, Controller, Inject, Post, UseGuards, Version } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";
import { Blog_SERVICE_V1 } from "../constants/blog.constant";
import { BlogServices } from "./blog.services";






@Controller("/api/manage-blog")
@UseGuards(RolesGuard)
export class BlogController{

    constructor(@Inject(Blog_SERVICE_V1) private readonly blogService: BlogServices) {
    }


    @Post("create-blog")
    //@ModuleAccess('Manage Blog')
    @Version("1")
    createBlog(@Body() dto:{title:string,content:string,tag:string}) 
    {

        console.log(dto);


        return { success: true }
    }
    









}