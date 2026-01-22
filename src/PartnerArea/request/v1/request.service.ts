import { Injectable } from "@nestjs/common";
import { IRequests } from "../interface/request.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { PatientQueryStatus } from "src/common/enum/patientQueryStatus";





@Injectable()
export class RequestServices implements IRequests{

    constructor(private readonly prisma:PrismaService){}


    async getPatientQueryRequest(clinicuuid: string,clinicuserid:string,page: number, limit: number) {



const clinics = await this.prisma.clinic.findMany({
  where: { clinicUserUuid: clinicuserid },
  select: { uuid: true }, 
});

console.log("clinics", clinics);

const clinicIds = clinics.map(clinic => clinic.uuid);
console.log("clinicIds", clinicIds);


const assignedQueries = await this.prisma.patientQuery.findMany({
  where: {
    clinicId: { in: clinicIds },
    status: PatientQueryStatus.ASSIGNED,
  },
  include:{
    clinic:{
        include:{
            clinicUser : true
        }
    }
  },
  orderBy:{
    createdAt : "desc"
  },

   ...((page > 0 && limit > 0) &&{
                    skip: (page - 1) * limit,
                    take: limit,
            })
});

console.log("assignedQueries", assignedQueries);


const totalCount = await this.prisma.patientQuery.count({
    where:{
    clinicId: { in: clinicIds },
    status: PatientQueryStatus.ASSIGNED,
    }
});


        return{
            status : 200,
            data : assignedQueries,
            totalCount
        }
    }



}