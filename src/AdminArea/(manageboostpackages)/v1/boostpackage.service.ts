import { Injectable } from "@nestjs/common";

import { PrismaService } from "src/prisma/prisma.service";
import { IBoostPackage } from "../interface/boostpackage.interafce";
import { BoostPackageCreateDto } from "./dto/boostpackage.create.dto";
import { BoostPackageUpdateDto } from "./dto/boostpackage.update.dto";





@Injectable()
export class BoostPackageServices implements IBoostPackage{

    constructor(private readonly prisma:PrismaService){}


    async getAll(page: number, limit: number, userid: number){
             const totalCount = await this.prisma.boostPackage.count();
        const getData = await this.prisma.boostPackage.findMany({
            
            include :{
              cliniclistingboost : {
                where : {
                    isActive : true
                }
              },
              clinics : {
                where :{
                    isActive : true
                }
              }  
            },
            orderBy:{
                createdAt : 'desc'
            },
             ...((page > 0 && limit > 0) &&{
                    skip: (page - 1) * limit,
                    take: limit,
                })
        });

         return {
            status : 200,
            data : getData,
            totalCount
        }

    }


    async createPackages(dto: BoostPackageCreateDto) {
        const createPackage = await this.prisma.boostPackage.create({
            data:{
                name : dto.name,
                price : dto.price,
                durationDays : Number(dto.duration),
                description : dto.description
            }
        });

        return {
            data : createPackage
        }
    }


    async updatePackages(dto: BoostPackageUpdateDto) {
        const updatedata = await this.prisma.boostPackage.update({
            where: {
                id : dto.id
            },
            data:{
                name : dto.name,
                price : dto.price,
                description : dto.description,
                durationDays : Number(dto.duration)
            }
        });

        return{
            data : updatedata
        }
        
    }


    
}