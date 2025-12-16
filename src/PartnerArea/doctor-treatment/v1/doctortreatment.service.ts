import { Injectable } from "@nestjs/common";
import { IDoctorTreatment } from "../interface/doctortreatment.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";
import { DoctorTreatmentDtoUpdate } from "./dto/doctortreatment.update.dto";





@Injectable()
export class DoctorTreatmentService implements IDoctorTreatment{


    constructor(private readonly prisma:PrismaService){}


      async getTreatment() {
        const getData = await this.prisma.treatment.findMany({});
    
        return {
          status: 200,
          message: "Treatment fetched successfully",
          data: getData
        }
      }
    
      async selectedTreatment(doctoruuid: any) {
    
        const getData = await this.prisma.doctorTreatment.findMany({
          where: {
            doctorUuid: doctoruuid
          },
          include: {
            treatment: {
              select: {
                name: true,
                id: true
              }
            },
            suggestedCategory: {
              where: {
                type: SuggestedType.Treatment,
                status: SuggestedCategoryStatus.Pending
              },
              select: {
                name: true,
                id: true
              }
            }
          }
        });
    
    
        return {
          status: 200,
          message: "",
          data: getData
        }
      }
    
      async removeTreatment(id: string) {
    
        const remove = await this.prisma.doctorTreatment.delete({
          where: {
            id: id
          }
        });
    
        return {
          status: 200,
          message: "Removed successfully"
        }
      }
    
      async deleteTreatment(dto: DoctorTreatmentDtoUpdate) {
        const deleted = await this.prisma.doctorTreatment.delete({
          where: {
            doctorUuid_treatmentid: {
              doctorUuid: dto.doctorUuid,
              treatmentid: dto.id,
            },
          },
        });
    
        return {
          status: 200,
          message: "Delete successfully",
        };
      }
    
    
    
      async selectTreatment(dto: DoctorTreatmentDtoUpdate) {
    
        const createData = await this.prisma.doctorTreatment.create({
          data: {
            doctorUuid: dto.doctorUuid,
            treatmentid: dto.treatmentid
          }
        });
    
        return {
          status: 201,
          message: "Specilization selected successfully"
        }
    
      }
    
    
       async createOther(dto: DoctorTreatmentDtoUpdate) {
              
                debugger;
                const newRequest = await this.prisma.specializationRequest.create({
                  data: {
                    name: String(dto.othertext),
                    type: SuggestedType.Treatment,
                    status: SuggestedCategoryStatus.Pending,
                  },
                });
      
               
               const doctorSpecialization = await this.prisma.doctorTreatment.create({
                  data: {
      
                    suggestedCategoryId: newRequest.id,
                    doctorUuid: dto.doctorUuid,
                  }
                });
      
      
               
                return {
                  status: 200,
                  data: doctorSpecialization,
                  message: "Your submission has been created successfully and is pending admin approval.",
                };
      }
    

    

}