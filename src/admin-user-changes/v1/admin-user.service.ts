import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateAdminUser } from "./dto/update-admin-user.dto";
import { AdminPassword } from "./dto/admin-password.dto";
import * as bcrypt from 'bcryptjs';



@Injectable()
export class AdminUserService{
    constructor(private prisma : PrismaService){}


    async getAdminUserDetails(id : number){
        
        const userdetail =await this.prisma.user.findUnique({
            where : {
                id : id
            }
        });
        
        console.log("user detils",userdetail);
        return {
            status : 200,
            message : "Data fetched successfully",
            data : userdetail
        }
    }


    async updateAdminUserDetails(dto: UpdateAdminUser,id : number){

        console.log("updating");
        const updateadminuserdetails =await this.prisma.user.update({
            where :{
                id : id
            },
            data : {
                firstname : dto.firstname ,
                lastname : dto.lastname ,
                address :  dto.address ,
                country : dto.country ,
                phone : dto.phone ,
                postalcode : dto.postalcode ,
                state : dto.state,
                Bio : dto.Bio
            }
        });


        return {
            status : 200,
            message : "Updated successfully",
            data : updateadminuserdetails
        }
    }



   async updateAdminPassword(dto: AdminPassword , id: number) {
    console.log("admin password started");
    


    const user = await this.prisma.user.findUnique({
          where: { id : id },
    });
    

     const passwordValid = await bcrypt.compare(dto.oldpassword, user!.password);  
    
    if (!passwordValid) {
         return {
            status: 400,
            message: 'Old password doesnt match',
        };

    }
    else{

         const hashedPassword = await bcrypt.hash(dto.newpassword, 10);
         await this.prisma.user.update({
            where : {
                id : id
            },
            data : {
                password : hashedPassword
            }
         });

         return {
            status: 200,
            message: 'New password has been changed',
        };

    }


   
  }





}