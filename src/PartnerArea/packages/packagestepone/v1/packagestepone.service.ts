
import { Injectable } from "@nestjs/common";
import { IPackageStepOneService } from "../interface/packagestepone.interface"
import { PrismaService } from "src/prisma/prisma.service"
import { PackageOneUpdateDto } from "./dto/packagestepone.update.dto";
import { PackageVerifyStatus } from "src/common/enum/packageVerifyStatus";
import { PackageVisibiltyStatus } from "src/common/enum/packageVisibiltyStatus";




@Injectable()
export class PackageStepOneServices implements IPackageStepOneService{

    constructor(private readonly prisma:PrismaService){}

    async getPackageList(clinicuuid: string) {

        const getData = await this.prisma.clinicPackage.findMany({
            where : {
                clinicId : clinicuuid,
                OR:[
                    {status : PackageVerifyStatus.VERIFIED},
                    {status : PackageVerifyStatus.PENDING}
                ]
            },
            include :{
                packagesDoctor : {
                   
                   include:{
                    doctors : true
                   }
                }
            },
            orderBy :{
                createdAt : 'desc'
            }
        });

        return {
            status : 200,
            data : getData
        }
    }



    async getPackageDetails(id: string) {

       try {
             const getData = await this.prisma.clinicPackage.findFirst({
            where :{
                id : id
            }
        });
        return {
            status : 200 ,
            message : "Package detauils fetched successfully",
            data :getData
        }
       } catch (error) {

            return{
                status : 500,
                message : error.message
            }
       }
    }



    async insertPackageStepOne(dto: PackageOneUpdateDto) {
        console.log(dto);

        if(dto.id){

            const updatepackage = await this.prisma.clinicPackage.update({
                where : {id : dto.id},
                data : {
                    title : dto.title,
                    briefdescription : dto.briefDescription,
                    actualprice : String(dto.actualPrice),
                    discountedprice : String(dto.discountedPrice),
                    homepagefeatures: String(dto.homepagefeatures)
                }
            });

            return {
                status : 200,
                data : updatepackage
            }

        }
        else{

             const createpackage = await this.prisma.clinicPackage.create({
                data : {
                    title : String(dto.title),
                    briefdescription : dto.briefDescription,
                    actualprice : String(dto.actualPrice),
                    discountedprice : String(dto.discountedPrice),
                    clinicId : dto.clinicId
                }
            });

            return {
                status : 201,
                data : createpackage
            }

        }

    }










}