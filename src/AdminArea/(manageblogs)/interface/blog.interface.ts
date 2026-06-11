




export interface IBlogService{


     createBlog(updateid:string,title:string,content:string,readingMinutes:string,metaTitle:string,metaKeywords:string,metaDescription:string,se_structure:string,og_structure:string,writerName:string,reviewerName:string,blogImageUrl:string,writerImageUrl:string,reviewerImageUrl:string,ogUrl:string,ogType:string,publisher:string,ogImageUrl:string);


      getBlogs(page: number, limit: number);

      deleteBlog(id : any,userId: number, ipAddress: string, userAgent: string);


      getBlogsById(Id:string);

      


}