import { Controller, Get, Headers, Inject, Ip, Param, Query, Req, UseGuards, Version } from "@nestjs/common";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { RolesGuard } from "src/common/guards/roles.guards";
import { ACTIVITY_SERVICE_V1 } from "../constants/activity.constants";
import type { IActivityService } from "../interface/activity.interface";
import type { AuthRequest } from "src/common/decorators/auth-request.interface";
import { UAParser } from "ua-parser-js";






@Controller("/api/admin-activity")
@UseGuards(RolesGuard)
export class AdminActivityController{


    constructor(@Inject(ACTIVITY_SERVICE_V1)private readonly activityService: IActivityService) 
    {
        
    }




    @Get()
    @ModuleAccess('Manage Activies')
    @Version("1")
    getAdminActivities( @Query('page') page: string,@Query('limit') limit: string, @Ip() ipAddress: string , @Headers('user-agent') userAgent: string,@Req() request: AuthRequest)
    {

        const userId = request.user?.sub;
                
        var uaInfo = (() => { 
        var result = new UAParser(userAgent).getResult(); 
        return `${result.browser.name} ${result.browser.version} on ${result.os.name} ${result.os.version}`; })();

        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        return this.activityService.getUserList(pageNumber,pageSize,userId!,ipAddress,uaInfo);
    }



            @Get("admin-particular-activities/:userId")
            @ModuleAccess('Manage Activies')
            @Version("1")
            getAdminActivity(@Param('userId') userId: string) {
                const id = Number(userId);
                return this.activityService.getAdminActivity(id);
            }








}