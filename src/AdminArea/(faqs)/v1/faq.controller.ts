import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, UseGuards, Version } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";
import { FaqServices } from "./faq.services";
import { FAQCONSTANT } from "../constant/faq.constant";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { CreateFaqDto } from "./dto/createFaqDto";
import type { AuthRequest } from "src/common/decorators/auth-request.interface";







@Controller("/api/faq")
@UseGuards(RolesGuard)
export class FaqController{
    constructor(@Inject(FAQCONSTANT) private readonly faqServices:FaqServices){}



    @Get("get-all")
    @ModuleAccess("Manage Faq")
    @Version("1")
    async getFaqs() {

        return await this.faqServices.getAll();
    }

    @Post("create-faq")
    @ModuleAccess("Manage Faq")
    @Version("1")
    async createFaq(@Body() dto:CreateFaqDto,@Req() request: AuthRequest){

        const userId = Number(request.user?.sub);
        
        return await this.faqServices.createFaq(dto,userId);
    }


    @Post("update-faq")
    @ModuleAccess("Manage Faq")
    @Version("1")
    async updateFaq(@Body() dto:CreateFaqDto,@Req() request: AuthRequest){

        const userId = Number(request.user?.sub);

        return await this.faqServices.updateFaq(dto,userId);
    
    
    
    }


    @Delete("delete-faq/:id")
    @ModuleAccess("Manage Faq")
    @Version("1")
    async deleteFaq(@Param("id") id:string,@Req() request: AuthRequest){

        const userId = Number(request.user?.sub);

        return await this.faqServices.deleteFaq(id,userId);
    }



    @Put("update-position")
    @ModuleAccess("Manage Faq")
    @Version("1")
    async updatePostion(@Body("postions") postions:[]){

    
        return await this.faqServices.updatePosition(postions);
    }




    




}