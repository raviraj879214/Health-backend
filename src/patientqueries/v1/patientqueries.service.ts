import { Injectable } from "@nestjs/common";
import { IPatientQueries } from "../interface/patientqueries.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { PatientQueryCreateDto } from "./dto/patientqueries.create.dto";




@Injectable()
export class PatientQueriesServices implements IPatientQueries{
    constructor(private readonly prisma:PrismaService){}


    async getPateintQueries(page: number, limit: number) {

        const totalCount = await this.prisma.patientQuery.count();

        const getData = await this.prisma.patientQuery.findMany({
               include:{
                package : true,
                clinic : true
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


    async getPatientQueryDetails(id: string) {
        const getData = await this.prisma.patientQuery.findUnique({
            where :{
                id : id
            },
            include:{
                clinic : true,
                package : true,
                paymentDetails : {
                    orderBy :{
                        createdAt : "desc"
                    }
                }
            }
        });

        return {
            status : 200,
            data : getData
        }
    }


    async insertFinalDealPrice(dto: PatientQueryCreateDto) {
        
        const createData = await this.prisma.patientQuery.update({
            where :{
                id : dto.patientqueryid
            },
            data :{
                finalPrice : String(dto.finalprice)
            }
        });

        return {
            status : 200,
            data : createData
        }

    }



}