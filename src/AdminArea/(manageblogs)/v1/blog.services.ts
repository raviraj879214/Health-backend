import { Injectable } from "@nestjs/common";
import { IBlogService } from "../interface/blog.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";
import { FileService } from "src/common/middleware/file.service";




@Injectable()
export class BlogServices implements IBlogService{

    constructor(private readonly prisma: PrismaService, private readonly activityLogService: ActivityLogService,private readonly fileService: FileService) {
    }


async createBlog(
    updateid: string,
    title: string,
    content: string,
    readingMinutes: string,
    metaTitle: string,
    metaKeywords: string,
    metaDescription: string,
    se_structure: any,
    og_structure: any,
    writerName: string,
    reviewerName: string,
    blogImageUrl: string,
    writerImageUrl: string,
    reviewerImageUrl: string,
    ogUrl: string,
    ogType: string,
    publisher: string,
    ogImageUrl: string
) {
    console.log("updateid:", updateid);

    const slug = title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

    const data: any = {
        title,
        content,
        titleurl: slug,
        readingminutes: readingMinutes,
        metatitle: metaTitle,
        metakeywords: metaKeywords,
        metadescription: metaDescription,
        se_structure: JSON.parse(se_structure || "{}"),
        writername: writerName,
        reviewername: reviewerName,
        ogurl: ogUrl,
        ogtype: ogType,
     
       
    };


    const isUpdate = !!updateid?.trim();

    if (isUpdate) {
        // Update image fields only if new images are provided
        if (blogImageUrl) {
            data.image_url = blogImageUrl;
        }

        if (writerImageUrl) {
            data.writerimage = writerImageUrl;
        }

        if (reviewerImageUrl) {
            data.reviewerimage = reviewerImageUrl;
        }
        if (ogImageUrl) {
            data.ogimageurl = ogImageUrl;
        }


        const updatedBlog = await this.prisma.blog.update({
            where: {
                id: Number(updateid),
            },
            data,
        });

        return {
            message: "Blog updated successfully",
            data: updatedBlog,
        };
    }

    // Create requires all image fields
    data.image_url = blogImageUrl;
    data.writerimage = writerImageUrl;
    data.reviewerimage = reviewerImageUrl;
    data.ogimageurl = ogImageUrl;

    const createdBlog = await this.prisma.blog.create({
        data,
        
    });

    return {
        message: "Blog created successfully",
        data: createdBlog,
    };
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
            
        }
    }



    async getBlogsById(Id: string) {
    
        const data = await  this.prisma.blog.findFirst({
            where :{
                titleurl : Id
            }
        });

        return{
            data : data
        }


    }




}