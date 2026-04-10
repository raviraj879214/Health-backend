import { Injectable } from "@nestjs/common";
import { IAdditionalServices } from "../interface/additionalservice.interface";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";





@Injectable()
export class AdditionalServices implements IAdditionalServices{

 private stripe: Stripe;

        constructor(private readonly prisma:PrismaService){
                this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-10-29.clover",
    });
        }


        async getPatinetQuery(page: number, limit: number, adminid: number) {
                const AdminDetails = await this.prisma.user.findUnique({
                        where: {
                                id: adminid
                        },
                        include: {
                                role: true
                        }
                });
                var cordinatorid = 0;
                if (AdminDetails?.role.name === "Cordinator") {
                        cordinatorid = AdminDetails.id;
                }
                else {
                        const coordinator = await this.prisma.user.findFirst({
                                where: {
                                        id: adminid,
                                        role: {
                                                name: "Super Admin",
                                        },
                                },
                                select: {
                                        id: true,
                                },
                        });
                        const coordinatorId = coordinator?.id;
                }
                const queryWhere: any = {};
                if (cordinatorid > 0) {
                        queryWhere.cordinatorid = adminid;
                }
                const totalCount = await this.prisma.patientQuery.count();
                const getData = await this.prisma.patientQuery.findMany({
                        where: queryWhere,
                       include: {
                                AdditionalServices: true,
                                AdditionalServicesPaymetnDetails: true
                                },
                        orderBy: {
                                createdAt: 'desc'
                        },
                        ...((page > 0 && limit > 0) && {
                                skip: (page - 1) * limit,
                                take: limit,
                        })
                });


               const additionalServicesList = await this.prisma.additionalServicesMaster.findMany({});

                return {
                        status: 200,
                        data: getData,
                        totalCount,
                        additionalServicesList
                }

        }


        async createServices(service: string, description: string, price: number,patientqueryid:string) {

                const createServices = await this.prisma.additionalServices.create({
                        data: {
                                label: service,
                                value: description,
                                price: price,
                                patientQueryId : patientqueryid
                               
                        }
                });

                const getValue = await this.prisma.additionalServicesMaster.findFirst({
                        where :{
                                label : service
                        }
                });

                if(!getValue){

                        await this.prisma.additionalServicesMaster.create({
                                data :{
                                        label : service,
                                        value : description,
                                        price : price
                                }
                        });
                }

                







                return {
                        data: createServices
                }
        }
        

        async updateServiceStatus(id: string) {
                const updateData = await this.prisma.additionalServices.updateMany({
                        where : {
                                patientQueryId : id
                        },
                        data :{
                                status : 1
                        }
                });

                return { 
                        data : true
                }
        }





       




}