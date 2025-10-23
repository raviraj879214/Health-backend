import { Injectable } from "@nestjs/common";
import { ISeoServices } from "../interface/seo.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";
import { SeoUpdateDto } from "./dto/seo.update";





@Injectable()
export class SeoServices implements ISeoServices {

    constructor(private readonly prisma:PrismaService,private readonly activityLogService: ActivityLogService)
    {

    }




    async getseopages()
    {
        const getseodropdowns = await this.prisma.seoPages.findMany({
            select :{
                seopage : true,
                id :true
            },
            orderBy : {
                created_at : "desc"
            }

        });

        return {
            status : 200,
            message : "For drop down seo pages",
            data : getseodropdowns
        }
    }


    async getseopagedetails(id: number) {

        const getdetailsofseopage =await this.prisma.seoPages.findUnique({
            where : {
                id : id
            }
        });

        return {
            status : 200,
            message : "page details fetched successfully",
            data : getdetailsofseopage
        }

    }


        async updateseopagedetails(dto: SeoUpdateDto,userId: number,ipAddress: string,userAgent: string) {


        try {

         


            if (!dto || !dto.id) {
            return { status: 400, message: "Invalid request: ID is required" };
            }

            // Check if slug already exists for another record
            const existingSlug = await this.prisma.seoPages.findUnique({
            where: { slug: dto.slug },
            });

            if (existingSlug && existingSlug.id !== Number(dto.id)) {
            return { status: 400, message: "Slug already exists for another page" };
            }

            // Update SEO page
            const updateseopages = await this.prisma.seoPages.update({
            where: { id: (dto.id) },
            data: {
                title: dto.title,
                slug: dto.slug,
                meta_title: dto.meta_title,
                meta_desc: dto.meta_desc,
                meta_keywords: dto.meta_keywords,
            },
            });

            // Log activity
            await this.activityLogService.createLog({
            userId,
            action: "Update",
            description: `${dto.title} Seo Updated Successfully`,
            entityType: "seoPages",
            entityId: Number(dto.id),
            ipAddress,
            userAgent,
            });

            return {
            status: 200,
            message: "Seo updated successfully",
            data: updateseopages,
            };
        } catch (error) {
            // Prisma throws a detailed error
            return {
            status: 500,
            message: error?.message || "Internal server error",
            };
        }
        }

   








}