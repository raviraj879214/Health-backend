import { Injectable } from "@nestjs/common";
import { IManageClinicSpecialization } from "../interface/managespecialization.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ClinicSpecializationUpdateDto } from "./dto/managespecialization.update.dto";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";







@Injectable()
export class ManageClinicSpecializationsServices implements IManageClinicSpecialization{

        constructor(private readonly prisma:PrismaService){}


        async getSpecializations() {
            
            const getData = await this.prisma.specialization.findMany({});
            

            return {
                status : 200,
                data : getData
            }
        }


        async getClinicSpecializations(clinicuuid:string) {

            console.log("clinicuuid",clinicuuid);

            const getData = await this.prisma.clinicSpecialization.findMany({
                    where :{
                        clinicUuid : clinicuuid
                    },
                    include :{
                        specialization : true,
                        suggestedCategory : true
                    },
                    
                
            });

            

             return {
                status : 200,
                data : getData
            }

        }



         async selectSpecialization(dto:ClinicSpecializationUpdateDto) {
        
                const createData = await this.prisma.clinicSpecialization.create({
                    data :{
                        clinicUuid : dto.clinicUuid!,
                        specializationId : dto.specializationId
                    }
                });

                return {
                  status : 201,
                  message : "Specilization selected successfully"
                }
            }


             async deleteSpecilaization(dto: ClinicSpecializationUpdateDto) {
                      const deleted = await this.prisma.clinicSpecialization.delete({
                        where: {
                         id : dto.id
                        },
                      });
            
                      return {
                        status: 200,
                        message: "Delete successfully",
                      };
                }




                async createOther(dto: ClinicSpecializationUpdateDto) {
                            console.log("etstse",dto);
                        
                          const newRequest = await this.prisma.specializationRequest.create({
                            data: {
                              name: String(dto.othertext),
                              type: SuggestedType.Specialization,
                              status: SuggestedCategoryStatus.Pending,
                            },
                          });
                
                         
                         const doctorSpecialization = await this.prisma.clinicSpecialization.create({
                            data: {
                              suggestedCategoryId: newRequest.id,
                              clinicUuid: dto.clinicUuid!,
                            }
                          });
                
                          return {
                            status: 200,
                            data: doctorSpecialization,
                            message: "Your submission has been created successfully and is pending admin approval.",
                          };
                 }
                


}