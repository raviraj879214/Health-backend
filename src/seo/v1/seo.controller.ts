import { Body, Controller, Get, Inject, Param, Put, Req, UseGuards, Version ,Headers, Ip } from "@nestjs/common";
import { SEO_SERVICE_V1 } from "../constant/seo.constant";
import { SeoServices } from "./seo.service";
import { RolesGuard } from "src/common/guards/roles.guards";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { SeoUpdateDto } from "./dto/seo.update";
import type { AuthRequest } from "src/common/decorators/auth-request.interface";
import { UAParser } from "ua-parser-js";




@Controller("/api/seo")

@UseGuards(RolesGuard)
export class SeoController{

    constructor(@Inject(SEO_SERVICE_V1)private readonly seoService  : SeoServices)
    {
    
    }




    @Get("get-seo-pages")
    @ModuleAccess('Manage Seo')
    @Version("1")
    getSeoPage()
    {
        return this.seoService.getseopages();
    }


    @Get("get-seo-page-details/:id")
    @ModuleAccess('Manage Seo')
    @Version("1")
    getSeoPageDetails(@Param("id") id : string)
    {

        return this.seoService.getseopagedetails(Number(id));
    }


    @Put("update-seo-page-details")
    @ModuleAccess('Manage Seo')
    @Version("1")
    updateSeoDetails(@Body() dto:SeoUpdateDto,@Ip() ipAddress: string , @Headers('user-agent') userAgent: string,@Req() request: AuthRequest)
    {

        const userId = request.user?.sub;
        var uaInfo = (() => { 
        var result = new UAParser(userAgent).getResult(); 
        return `${result.browser.name} ${result.browser.version} on ${result.os.name} ${result.os.version}`; })();

       
        return this.seoService.updateseopagedetails(dto,userId!,ipAddress,uaInfo)    ;
    }








    












}