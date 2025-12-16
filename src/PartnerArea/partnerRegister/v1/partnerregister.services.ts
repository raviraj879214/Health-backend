import { BadRequestException, Get, Injectable } from "@nestjs/common";
import { IPartnerRegister } from "../interface/partnerregister.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { PartnerRegister } from "src/common/enum/PartnerRegister";
import * as bcrypt from 'bcrypt';
import { PartnerRegisterClinicDetails, partnerRegisterCreateDto } from "./dto/partnerregister.update.dto";







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

   
    async getClinicDetails(uuid: string) {

        const clinicdetails = await this.prisma.clinic.findFirst({
            where :{
                clinicUserUuid : uuid
            }
        });

        return {
            status : 200,
            data : clinicdetails
        }
    }
    

    async insertClinicDetails(dto: PartnerRegisterClinicDetails) {

        console.log("dto.websiteurl",dto);

            
        const existingClinic = await this.prisma.clinic.findFirst({
            where: {
                name: dto.name,
            },
        });

            
        if (existingClinic && existingClinic.clinicUserUuid !== dto.uuid && dto.name) {
            throw new BadRequestException('Clinic name already exists');
         }




         const checkexist = await this.prisma.clinic.findFirst({
            where : {
                clinicUserUuid : dto.uuid
            }
         });


        
         if(checkexist){

            const updateData = await this.prisma.clinic.update({
                where : {uuid : String(checkexist.uuid)},
                data : {
                    name : dto.name,
                    websiteurl : dto.websiteurl,
                    country : dto.country,
                    city : dto.city
                }
            });


            return {
                status : 200,
                data : updateData
            }
         }






          const clinic = await this.prisma.clinic.create({
                data: {
                    name: dto.name,
                    websiteurl: dto.websiteurl,
                    clinicUserUuid : dto.uuid,
                    country : dto.country,
                    city : dto.city,
                    userId : 1
                },
            });



            return {
                status : 200,
                data : clinic
            }

    }
    


    async getCountryCity() {
        
        const country = await this.prisma.country.findMany({
            include : {
                cities : true
            }
        });
        const state = await this.prisma.city.findMany({});


        return {
            status : 200,
            country : country,
            state : state
        }
    }










    


}