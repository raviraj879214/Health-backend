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

        get client() {
    return this.stripe;
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
                                AdditionalServicesPaymetnDetails: {
                                        orderBy : {
                                                createdAt : "desc"
                                        }
                                }
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
                                patientQueryId : patientqueryid,
                                paymentstatus : 0
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
                                status : 2
                        }
                });

                return { 
                        data : true
                }
        }




        async updateService(id: string, label: string, description: string, price: string) {
                const updateData = await this.prisma.additionalServices.update({
                        where: {
                                id: id
                        },
                        data: {
                                label: label,
                                value: description,
                                price: price
                        }
                });


                const getValue = await this.prisma.additionalServicesMaster.findFirst({
                        where: {
                                label: label.trim()
                        }
                });

                if (!getValue) {

                        await this.prisma.additionalServicesMaster.create({
                                data: {
                                        label: label,
                                        value: description,
                                        price: price
                                }
                        });
                }
                return {
                        data: updateData
                }
        }


       

        async deleteService(id: string) {
                const deleteservices = await this.prisma.additionalServices.delete({
                        where :{
                                id : id
                        }
                });

                return {
                        data : deleteservices
                }
        }




        async deletePaymentLink(id: string) {
                const data = await this.prisma.additionalServicesPaymetnDetails.findUnique({
                        where: { id }
                });

                if (!data?.sessionid) {
                        throw new Error("Session ID is required");
                }

                const session = await this.stripe.checkout.sessions.retrieve(
                        data.sessionid.toString()
                );

                 let additionids: string[] = [];

                if (session?.metadata?.additionids) {
                        additionids = session.metadata.additionids.split(',');
                }


                if (session.status === "open") {
                        await this.stripe.checkout.sessions.expire(session.id);
                        console.log("Session expired successfully");
                        await this.prisma.additionalServicesPaymetnDetails.delete({
                                 where: { id }
                         });

                        

                        await this.prisma.additionalServices.deleteMany({
                                where: {
                                        id: {
                                                in: additionids,
                                        },
                                }
                        });



                } else {
                        console.log("Session already:", session.status);
                        
                }

                return {
                        data:true,
                        additionids:additionids
                        
                }
        }


}