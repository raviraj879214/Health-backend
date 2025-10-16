import { Controller, Get, Inject, UseGuards, Version } from "@nestjs/common";
import { Tag_SERVICE_V1 } from "../constants/tags.constant";
import { TagsService } from "./tags.service";






@Controller("/api/tags")

export class TagsController{

     constructor(@Inject(Tag_SERVICE_V1)private readonly tagsService  : TagsService)
     {
        

     }


     @Get("get-tags")
     @Version("1")
     getTagsd(){

        
        return this.tagsService.getTags();
     }










}