import { PrismaService } from "src/prisma/prisma.service";
import { ICategoryService } from "../interface/category.interface";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";
import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create.category";
import { UpdateCategoryDto } from "./dto/update.create";




@Injectable()
export class CategoryService implements ICategoryService{


    constructor(private readonly prisma:PrismaService, private readonly activityLogService: ActivityLogService){}


    
    async getCategory(page?: number, limit?: number) {
    const totalCount = await this.prisma.category.count();

    // Step 1: Fetch all categories (for hierarchy)
    const allCategories = await this.prisma.category.findMany({
     orderBy: [
      { parent_category_id: 'asc' },
      { sort_order: 'asc' },
      { id: 'asc' },
    ],
    });



    // Step 2: Build a tree
    const buildTree = (parentId: number | null = null) => {
        return allCategories
        .filter(cat => cat.parent_category_id === parentId)
        .map(cat => ({
            ...cat,
            children: buildTree(cat.id),
        }));
    };

    // Step 3: Flatten tree for ordered output
    const flattenTree = (nodes: any[], result: any[] = [], level = 1) => {
        for (const node of nodes) {
        result.push({ ...node, level }); // 👈 now starts at 1
        if (node.children && node.children.length) {
            flattenTree(node.children, result, level + 1);
        }
        }
        return result;
    };

    const tree = buildTree();
    let datalist = flattenTree(tree, [], 1); // 👈 start from 1

    // Step 4: Apply pagination if requested
    if (page && limit && page > 0 && limit > 0) {
        const start = (page - 1) * limit;
        datalist = datalist.slice(start, start + limit);
    }

    return { data: datalist, totalCount };
    }



    async createCategory(dto: CreateCategoryDto,userId: number, ipAddress: string, userAgent: string) {

        const categoryexist = await this.prisma.category.findFirst({
            where : {
                name : dto.name
            }
        });

        if(categoryexist){
            return {
                status : 409,
                message : "Category exist already"
            }
        }

        let parentlevel = 0;

         let pathIds = "";
         let fullPath = dto.name;

        if(dto.parent_category_id)
        {
            var parentcatdetails =await this.prisma.category.findFirst({
                    where :{
                        id  : Number(dto.parent_category_id)
                    }
             });


             parentlevel = Number(parentcatdetails?.level);

             if(dto.parent_category_id > 0){
                pathIds = `${parentcatdetails?.path_ids}/${parentcatdetails?.id}/`
             }
             
             fullPath = `${parentcatdetails?.full_path} > ${dto.name}`;
        }
        

    let level = 1 + parentlevel; 


     const category = await this.prisma.category.create({
            data: {
                name: dto.name,
                slug: dto.slug || dto.name.toLowerCase().replace(/\s+/g, '-'),
                parent_category_id: dto.parent_category_id == 0 ? null : Number(dto.parent_category_id),
                description: dto.description ?? null,
                icon: dto.icon ?? null,
                sort_order: dto.sort_order ?? 0,
                status: 'active',
                is_featured: dto.is_featured ?? false,
                level : level,
                created_by : userId,
                path_ids: pathIds !== "" ? pathIds : null,
                full_path : fullPath
             },
            });

        return {
            status : 200,
            message : "Category created successfully",
            data :category
        }
    }



    async deleteCategory(id: number, userId: number, ipAddress: string, userAgent: string) {

        const deletecategory =await this.prisma.category.delete({
            where : {
                id : Number(id)
            }
        });

        return {
            status : 200,
            message : "Deleted successfully",
            data : deletecategory
        }


    }

    

  async updateCategory(dto: UpdateCategoryDto, userId: number, ipAddress: string, userAgent: string) {
    console.log(dto.parent_category_id);
    console.log(dto.name);
    console.log(dto.id);

    // 1️⃣ Check for duplicate name under same parent
    const categoryExist = await this.prisma.category.findFirst({
        where: {
            name: dto.name,
            id: { not: dto.id },
            parent_category_id: dto.parent_category_id ?? null,
        },
    });

    if (categoryExist) {
        return {
            status: 409,
            message: "Category already exists under this parent",
        };
    }

    // 2️⃣ Fetch parent details if applicable
    let parentLevel = 0;
    let pathIds = "";
    let fullPath = dto.name;

    if (dto.parent_category_id) {
        const parentCat = await this.prisma.category.findFirst({
            where: { id: Number(dto.parent_category_id) },
        });

        if (parentCat) {
            parentLevel = parentCat.level || 0;

            if (dto.parent_category_id > 0) {
                pathIds = `${parentCat.path_ids || ""}/${parentCat.id}/`;
            }

            fullPath = `${parentCat.full_path} > ${dto.name}`;
        }
    }

   
    const level = 1 + parentLevel;

   
    

    // 5️⃣ Update category
    const updatedCategory = await this.prisma.category.update({
        where: { id: dto.id },
        data: {
            name: dto.name,
            slug: dto.name.toLowerCase().replace(/\s+/g, '-'),
            parent_category_id: dto.parent_category_id ? Number(dto.parent_category_id) : null,
            level: level,
            path_ids: pathIds !== "" ? pathIds : null,
            full_path: fullPath,
            updated_by: userId,
            updated_at: new Date(),
        },
    });

    return {
        status: 200,
        message: "Category updated successfully",
        data: updatedCategory,
    };
    }

    
async updateFeatured(id: number, featured: boolean) {
    console.log(featured);
  const categoryFeaturedUpdate = await this.prisma.category.update({
    where: { id },
    data: { is_featured: featured },
  });

  return {
    status: 200,
    message: "Featured updated successfully",
    data : categoryFeaturedUpdate
  };
}







    }







