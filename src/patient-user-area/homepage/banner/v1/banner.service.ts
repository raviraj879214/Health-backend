import { Injectable } from "@nestjs/common";
import { IHomePageBanner } from "../interface/banner.interface";
import { PrismaService } from "src/prisma/prisma.service";








@Injectable()
export class HomePageBannerServices implements IHomePageBanner{
    constructor(private readonly prisma:PrismaService){}



    async getSpecialization() {
        const getData = await this.prisma.specialization.findMany({
           include: {
                _count: {
                select: {
                    clinics: true,
                },
                },
            },
        });


        return {
            status : 200,
            data :getData
        }
    }

    async getSpecialty() {
        const getData = await this.prisma.specialty.findMany({
            include: {
                _count: {
                select: {
                    clinicsSpecialty: true,
                },
                },
            },
        });

         return {
            status : 200,
            data :getData
        }

    }

    async getTreatmetnt() {

         const getData = await this.prisma.treatment.findMany({
            include: {
                _count: {
                select: {
                    clinicTreatments: true,
                },
                },
            },
         });

         return {
            status : 200,
            data :getData
        }
        
    }




}