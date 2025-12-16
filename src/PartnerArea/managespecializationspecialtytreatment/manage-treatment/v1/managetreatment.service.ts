import { Injectable } from "@nestjs/common";
import { IManageClinicTreatment } from "../interace/managetreatment.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ClinicTreatmentUpdateDto } from "./dto/managetreatment.update.dto";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";


@Injectable()
export class ManageClinicTreatmentServices implements IManageClinicTreatment{

    constructor(private readonly prisma:PrismaService){}



     async getTreatments() {
                        
                        const getData = await this.prisma.treatment.findMany({});
                        
            
                        return {
                            status : 200,
                            data : getData
                        }
                    }
            
            
                    async getClinicTreatments(clinicuuid:string) {
            
                       
            
                        const getData = await this.prisma.clinicTreatment.findMany({
                                where :{
                                    clinicUuid : clinicuuid
                                },
                                include :{
                                    treatment : true,
                                    suggestedCategory : true
                                },
                                
                            
                        });
            
                         return {
                            status : 200,
                            data : getData
                        }
            
                    }
            
            
            
                     async selectTreatment(dto:ClinicTreatmentUpdateDto) {
                    
                            const createData = await this.prisma.clinicTreatment.create({
                                data :{
                                    clinicUuid : dto.clinicUuid!,
                                    treatmentid : dto.treatmentid
                                }
                            });
            
                            return {
                              status : 201,
                              message : "Specilization selected successfully"
                            }
                        }
            
            
                         async deleteTreatments(dto: ClinicTreatmentUpdateDto) {
                                  const deleted = await this.prisma.clinicTreatment.delete({
                                    where: {
                                     id : dto.id
                                    },
                                  });
                        
                                  return {
                                    status: 200,
                                    message: "Delete successfully",
                                  };
                            }
            
            
            
            
                            async createOther(dto: ClinicTreatmentUpdateDto) {
                                        console.log("etstse",dto);
                                    
                                      const newRequest = await this.prisma.specializationRequest.create({
                                        data: {
                                          name: String(dto.othertext),
                                          type: SuggestedType.Treatment,
                                          status: SuggestedCategoryStatus.Pending,
                                        },
                                      });
                            
                                     
                                     const doctorSpecialization = await this.prisma.clinicTreatment.create({
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