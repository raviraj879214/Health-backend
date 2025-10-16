import { CreatedBlog } from "../v1/dto/create.blog";
import { UpdatedBlog } from "../v1/dto/update.blog";




export interface IBlogService{


    getBlogs(page: number, limit: number);

    createBlog(dto : CreatedBlog ,userId: number, ipAddress: string, userAgent: string);


    updateBlog(dto:UpdatedBlog,userId: number, ipAddress: string, userAgent: string);


    deleteBlog(id : any,userId: number, ipAddress: string, userAgent: string);

}