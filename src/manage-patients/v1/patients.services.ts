import { Injectable } from "@nestjs/common";
import { IPatientServices } from "../interface/patients.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";
import { PatientBusiness } from "./business/PatientBusiness";
import { PatientUpdateDto } from "./dto/patients.update.dto";
import { PatientRegister } from "src/common/enum/PatientRegistration";




@Injectable()
export class PatientService implements IPatientServices{

    constructor(private readonly prisma : PrismaService,
                private readonly activityLogService: ActivityLogService,
                private readonly patientBusiness : PatientBusiness
            ){}


    async getPatientlist(page: number, limit: number,status : string) {
        const totalCount = await this.prisma.patients.count({where: {status: Number(status),},});
        const allpatients = await this.prisma.patients.findMany({
            where : {status : Number(status)},
            skip: (page - 1) * limit, 
            take: limit,
            });

        return {
            totalCount,
            data : allpatients
        }
    }


   async getPatientDetails(uuid: string) {

       
        this.patientBusiness.validId(uuid);
     
        const patientdetails = await this.prisma.patients.findFirst({
            where: {
            uuid
            }
        });

        
        return {
            status: 200,
            message: "patient details fetched successfully",
            data: patientdetails
        };
     }



     async updateBlockStatus(dto: PatientUpdateDto) {
         
        this.patientBusiness.validId(dto.id);

        const updatePatient = await this.prisma.patients.update({
                where :{
                    id : Number(dto.id)
                },
                data :{
                    blockreason : dto.blockreason,
                    status : Number(PatientRegister.BLOCKED)
                }
        });

        return {
            status : 200,
            message : "Patient blocked successfully",
            data : updatePatient
        }
     }



     async updateUnBlockStatus(id: number) {
         
            this.patientBusiness.validId(id);

            const updateUnBlockstatus = await this.prisma.patients.update({
                where :{
                    id : Number(id)
                },
                data :{
                    status : PatientRegister.ACTIVE,
                    blockreason : null
                }
            });

            return {
                status : 200,
                message : "Patient un-blocked successfully",
                data : updateUnBlockstatus
            }


     }





}