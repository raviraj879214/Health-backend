
import { Controller, Post, Get, Patch, Delete, Param, Body, Version, Put, UseGuards, Ip , Headers, Req  } from '@nestjs/common';
import { EmailTemplateServics } from './emailtemplate.service';
import { UpdateEmailModule } from './dto/update-email-dto';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { ModuleAccess } from 'src/common/decorators/module-access.decorator';
import type { AuthRequest } from 'src/common/decorators/auth-request.interface';
import { UAParser } from 'ua-parser-js';


@Controller('api/email-templates')
@UseGuards(RolesGuard)


export class EmailtemplateController{


    constructor(private readonly emailtemplateService : EmailTemplateServics){}


    @Get()
    @ModuleAccess('Manage Email')
    @Version('1')
    getEmailtemplates(){
        return this.emailtemplateService.getEmailSubject();
    }


    @Put()
     @ModuleAccess('Manage Email')
     @Version('1')
     updateEmailbody(@Body() dto: UpdateEmailModule , @Ip() ipAddress: string , @Headers('user-agent') userAgent: string,@Req() request: AuthRequest){
        
        const userId = request.user?.sub;
        
        var uaInfo = (() => { 
        var result = new UAParser(userAgent).getResult(); 
        return `${result.browser.name} ${result.browser.version} on ${result.os.name} ${result.os.version}`; })();

        return this.emailtemplateService.updateEmailTemplate(dto,userId,ipAddress,uaInfo);
     }










}
