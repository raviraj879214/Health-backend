import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IDoctorSpecializationService } from "../interface/doctorspecialization.interface";
import { DoctorSpecializationUpdateDto } from "./dto/doctorspecialization.update.dto";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";




@Injectable()
export class DoctorSpecializationService implements IDoctorSpecializationService{

    constructor(private readonly prisma:PrismaService){}

    async getSpecilization() {
      const getSpecializations = await this.prisma.specialization.findMany({});

      return {
        status : 200,
        message : "Specialization fetchd successfully",
        data : getSpecializations
      }
    }


    async selectSpecialization(dto:DoctorSpecializationUpdateDto) {

        const createData = await this.prisma.doctorSpecialization.create({
            data :{
                doctorUuid : dto.doctorUuid,
                specializationId : dto.specializationId
            }
        });

        return {
          status : 201,
          message : "Specilization selected successfully"
        }

    }



    async selectedSpecialization(doctoruuid: string) {


      const getData = await this.prisma.doctorSpecialization.findMany({
        where : {
          doctorUuid : doctoruuid
        },
        include:{
          specialization :{
            select :{
              name : true,
              id : true
            }
          },
          suggestedCategory :{
            where :{ type : SuggestedType.Specialization,
                status : SuggestedCategoryStatus.Pending
            },
            select : {
              name : true,
              id: true
            }
          }
        }
      });


      return {
        status : 200,
        message : "",
        data : getData
      }
    }



    async removeSpecialization(id: string) {

      const remove = await this.prisma.doctorSpecialization.delete({
        where : {
          id :id
        }
      });

      return {
        status : 200,
        message : "Removed successfully"
      }
    }


    async deleteSpecilaization(dto: DoctorSpecializationUpdateDto) {
          const deleted = await this.prisma.doctorSpecialization.delete({
            where: {
              doctorUuid_specializationId: {
                doctorUuid: dto.doctorUuid,
                specializationId: dto.id,       // dto.id = specializationId
              },
            },
          });

          return {
            status: 200,
            message: "Delete successfully",
          };
        }

       async createOther(dto: DoctorSpecializationUpdateDto) {
        
        
          const newRequest = await this.prisma.specializationRequest.create({
            data: {
              name: String(dto.othertext),
              type: SuggestedType.Specialization,
              status: SuggestedCategoryStatus.Pending,
            },
          });

         
         const doctorSpecialization = await this.prisma.doctorSpecialization.create({
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