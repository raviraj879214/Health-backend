import { Injectable } from "@nestjs/common";
import { IBlogService } from "../interface/blog.interface";
import { CreatedBlog } from "./dto/create.blog";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";
import { UpdatedBlog } from "./dto/update.blog";
import { FileService } from "src/common/middleware/file.service";




@Injectable()
export class BlogServices implements IBlogService{

    constructor(private readonly prisma : PrismaService, private readonly activityLogService: ActivityLogService,private readonly fileService: FileService )
    {
        
    }





   async createBlog(dto: CreatedBlog, userId: number, ipAddress: string, userAgent: string) {

         const titleUrl = dto.title ? dto.title.trim().toLowerCase().replace(/\s+/g, "-") : "";
         const tagUrl = dto.tagid ? dto.tagid.trim().toLowerCase().replace(/\s+/g, "-") : "";

        const createblog = await this.prisma.blog.create({
            data : {
                title : dto.title,
                content : dto.content,
                image_url : dto.image_url,
                tagId : dto.tagid,
                tagurl : tagUrl,
                titleurl : titleUrl
            }
        });

        this.activityLogService.createLog({
            userId :  userId,
            action: 'Create',
            description: dto.title +  " Blog Created Successfully",
            entityType: '',
            entityId: 0,
            ipAddress : ipAddress,
            userAgent : userAgent,
        });

        

        return {
            status : 200,
            message : "Blog created successfully",
            data : createblog
        }
    }




   async updateBlog(dto: UpdatedBlog, userId: number, ipAddress: string, userAgent: string) {
    

    if (!dto.id) {
        return {
            status: 404,
            message: "Blog doesn't exist",
        };
    }



    console.log("!dto.image_url : ");

    if (dto.image_url != null) {
        console.log("!dto.image_url : ");

        const existingBlog = await this.prisma.blog.findUnique({
            where: { id: Number(dto.id) },
            select: { image_url: true },
        });

       
        if (existingBlog?.image_url) {
            this.fileService.deleteImage(existingBlog.image_url, "blogs");
        }
    }




     const titleUrl = dto.title ? dto.title.trim().toLowerCase().replace(/\s+/g, "-") : "";
         const tagUrl = dto.tagid ? dto.tagid.trim().toLowerCase().replace(/\s+/g, "-") : "";
    const updatedBlog = await this.prisma.blog.update({
        where: { id: Number(dto.id) },
        data: {
            title: dto.title,
            content: dto.content,
            image_url: dto.image_url,
            tagId : dto.tagid,
            updated_at : new Date(),
            tagurl : tagUrl,
            titleurl : titleUrl
        },
    });

    // Log the activity
    await this.activityLogService.createLog({
        userId,
        action: "Update",
        description: `${dto.title} blog updated successfully`,
        entityType: "Blog",
        entityId: Number(dto.id),
        ipAddress,
        userAgent,
    });

    return {
        status: 200,
        message: "Blog updated successfully",
        data: updatedBlog,
    };
}




        async deleteBlog(id: number, userId: number, ipAddress: string, userAgent: string) {
        try {
                const deletedBlog = await this.prisma.blog.delete({
                    where: { id: id },
                });

               if (deletedBlog.image_url) {
                         this.fileService.deleteImage(deletedBlog.image_url, "blogs");
                }

                // Log the deletion activity
                await this.activityLogService.createLog({
                    userId: userId,
                    action: 'Delete',
                    description: `${deletedBlog.title} Blog Deleted Successfully`,
                    entityType: 'Blog',
                    entityId: deletedBlog.id,
                    ipAddress: ipAddress,
                    userAgent: userAgent,
                    });

                    return {
                    status: 200,
                    message: 'Blog Deleted Successfully',
                };
        } 
        catch (error) 
        {
            // Prisma throws P2025 if record not found
            if (error.code === 'P2025') {
            return {
                status: 404,
                message: "Blog Doesn't Exist",
            };
            }

            // Re-throw other unexpected errors
            throw error;
        }
    }



    async  getBlogs(page: number, limit: number) {
        
        const blogslist = await  this.prisma.blog.findMany({
             skip: (page - 1) * limit, 
            take: limit,
             orderBy: {
                created_at: 'desc', // newest first
            },
        });

        return {
            status : 200,
            message : "Data Fetched Successfully",
            data : blogslist
        }

    }






}