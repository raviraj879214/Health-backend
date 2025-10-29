import { Body, Controller, Get, Inject, Ip, Post, Query, Req, UseGuards, Version ,Headers, Delete, Param, Put } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";
import { CATEGORY_SERVICE_V1 } from "../constant/category.constant";
import { CategoryService } from "./category.service";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import type { AuthRequest } from "src/common/decorators/auth-request.interface";
import { UAParser } from "ua-parser-js";
import { CreateCategoryDto } from "./dto/create.category";
import { UpdateCategoryDto } from "./dto/update.create";







@Controller("/api/categories")
@UseGuards(RolesGuard)
export class CategoryController{

        constructor(@Inject(CATEGORY_SERVICE_V1)private readonly categiryService:CategoryService ){

        }


        @Get("/get-category")
        @ModuleAccess("Manage Category")
        @Version("1")
        getCategories(@Query('page') page: string,@Query('limit') limit: string){
            const pageNumber = parseInt(page) || 0;
            const pageSize = parseInt(limit) || 0;

            return this.categiryService.getCategory(pageNumber,pageSize);
        }


        @Post("/create-category")
        @ModuleAccess("Manage Category")
        @Version("1")
        createCategories(@Body() dto:CreateCategoryDto,@Ip() ipAddress: string , @Headers('user-agent') userAgent: string,@Req() request: AuthRequest){
                const userId = request.user?.sub;
                var uaInfo = (() => { 
                var result = new UAParser(userAgent).getResult(); 
                return `${result.browser.name} ${result.browser.version} on ${result.os.name} ${result.os.version}`; })();

                return this.categiryService.createCategory(dto,userId!,ipAddress,uaInfo);
        }



        @Put("/update-category")
        @ModuleAccess("Manage Category")
        @Version("1")
        updateCategories(@Body() dto:UpdateCategoryDto,@Ip() ipAddress: string , @Headers('user-agent') userAgent: string,@Req() request: AuthRequest){
                const userId = request.user?.sub;
                var uaInfo = (() => { 
                var result = new UAParser(userAgent).getResult(); 
                return `${result.browser.name} ${result.browser.version} on ${result.os.name} ${result.os.version}`; })();

                return this.categiryService.updateCategory(dto,userId!,ipAddress,uaInfo);
        }



        @Delete("/delete-category/:id")
        @ModuleAccess("Manage Category")
        @Version("1")
        deleteCategories(@Param('id') id: string,@Ip() ipAddress: string , @Headers('user-agent') userAgent: string,@Req() request: AuthRequest){

            const userId = request.user?.sub;
            var uaInfo = (() => { 
            var result = new UAParser(userAgent).getResult(); 
            return `${result.browser.name} ${result.browser.version} on ${result.os.name} ${result.os.version}`; })();
            return this.categiryService.deleteCategory(Number(id),userId!,ipAddress,uaInfo)
        } 


       @Put('update-featured/:id/:featured')
@ModuleAccess("Manage Category")
@Version("1")
updateFeature(
  @Param('id') id: string,
  @Param('featured') featured: string, // 👈 keep as string
  @Ip() ipAddress: string,
  @Headers('user-agent') userAgent: string,
  @Req() request: AuthRequest
) {
  const userId = request.user?.sub;

  const uaInfo = (() => {
    const result = new UAParser(userAgent).getResult();
    return `${result.browser.name} ${result.browser.version} on ${result.os.name} ${result.os.version}`;
  })();

  // ✅ Convert string to boolean manually
  const isFeatured = featured === 'true' || featured === '1';
        console.log("controller", isFeatured);

return this.categiryService.updateFeatured(Number(id), isFeatured);

}











}