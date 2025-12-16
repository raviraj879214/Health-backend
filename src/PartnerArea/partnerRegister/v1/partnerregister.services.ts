import { Injectable } from "@nestjs/common";
import { IPartnerRegister } from "../interface/partnerregister.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { PartnerRegister } from "src/common/enum/PartnerRegister";
import * as bcrypt from 'bcrypt';
import { partnerRegisterCreateDto } from "./dto/partnerregister.update.dto";







@Injectable()
export class PartnerRegisterServices implements IPartnerRegister{

    constructor(private readonly prisma:PrismaService){}


    async validateEmailAndOtp(email:string) {




        const checkEmail = await this.prisma.clinicUser.findFirst({
            where :{
                email : email,       
            }
        });
        
        console.log("email",email);


        if(!checkEmail){

           const randomOtp = Math.floor(1000 + Math.random() * 9000);

            const hash = await bcrypt.hash("Aalpha@100", 10);
            const createEmail =  await this.prisma.clinicUser.create({
                data : {
                    email : email,
                    passwordHash : hash
                }
            });

            return {
                status : "Email Created and sent otp to registered email",
                data:  createEmail,
                otp : randomOtp
            }

        }
        else if(checkEmail?.isOtpVerify == false && checkEmail.status == PartnerRegister.PENDING){

            const randomOtp = Math.floor(1000 + Math.random() * 9000);

             return {
                status : "Email Created and sent otp to registered email",
                data:  checkEmail,
                otp : randomOtp
            }
        }
        else if(checkEmail?.isOtpVerify == true && checkEmail.status == PartnerRegister.PENDING){

            return {
                status : 200,
                data:  checkEmail
            }
        }
        else if(checkEmail.email === email && checkEmail.status !== PartnerRegister.PENDING){

            return {
                status : 404,
                message : "This email is already registered. Please log in to continue."
            }
        }
        else{

             return {
                status : 200,
                data:  checkEmail
            }
        }
    }


    async updateOtpServices(dto: partnerRegisterCreateDto) {
        
        const updatData = await this.prisma.clinicUser.update({
            where : {uuid : dto.uuid},
            data : {
                isOtpVerify : dto.isOtpVerify
            }
        });

        return {
            status : 200,
            message : "User updated successfully"
        }
    }


    async getClinicUserDetail(uuid: string) {

        const getData = await this.prisma.clinicUser.findFirst({
            where :{
                uuid : uuid
            }
        });

        return{
            status : 200,
            data : getData
        }
    }

    async insertClinicUserDetails(dto: partnerRegisterCreateDto) {


         const hashed = await bcrypt.hash(dto.password!, 10);
     
        const updateData = await this.prisma.clinicUser.update({
            where : {uuid : dto.uuid},
            data : {
                firstname: String(dto.firstname),
                lastname : String(dto.lastname), 
                passwordHash : hashed
                
            }
        });


        return {
            status : 200,
            message : "user updated successfully"
        }

    }












    


}