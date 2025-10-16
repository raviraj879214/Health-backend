import { Body, Controller, Get, Post, Put, Req, UseGuards, Version } from "@nestjs/common";
import { UpdateAdminUser } from "./dto/update-admin-user.dto";
import { AdminUserService } from "./admin-user.service";
import { RolesGuard } from "src/common/guards/roles.guards";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import type { AuthRequest } from "src/common/decorators/auth-request.interface";
import { AdminPassword } from "./dto/admin-password.dto";



@Controller("/api/admin-user")
@UseGuards(RolesGuard)

export class Adminusercontroller{
    constructor (private readonly adminuserservice : AdminUserService){}

    @Get()
    @ModuleAccess('Manage Admin User')
    @Version("1")
    getAdminUser(@Req() request: AuthRequest)
    {
        const userId = request.user?.sub;
        return this.adminuserservice.getAdminUserDetails(userId!);
    }



    @Put()
    @ModuleAccess('Manage Admin User')
    @Version("1")
    updateAdminUser(@Body() dto: UpdateAdminUser , @Req() request: AuthRequest)
    {
        const userId = request.user?.sub;
       

        return this.adminuserservice.updateAdminUserDetails(dto,userId!);
    }


    @Put('update-password')
    @ModuleAccess('Manage Admin User')
    @Version("1")
    updateAdminPassword(@Body() dto : AdminPassword ,@Req() request: AuthRequest){
        const userId = request.user?.sub;
        console.log("old password",dto.oldpassword);
        console.log("new password",dto.newpassword);
        console.log("userId",userId);

        return this.adminuserservice.updateAdminPassword(dto,userId!);


    }





    
}
