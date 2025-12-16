import { Injectable } from "@nestjs/common";
import { IManageClinicSpecialty } from "../interface/managespecialty.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ClinicSpecialityUpdateDto } from "./dto/managespecialty.update.dto";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";






@Injectable()
export class ManageSpecialtyServices implements IManageClinicSpecialty{

    constructor(private readonly prisma:PrismaService){}


           async getSpecialitys() {
                    
                    const getData = await this.prisma.specialty.findMany({});
                    
        
                    return {
                        status : 200,
                        data : getData
                    }
                }
        
        
                async getClinicSpecialitys(clinicuuid:string) {
        
                   
        
                    const getData = await this.prisma.clinicSpecialty.findMany({
                            where :{
                                clinicUuid : clinicuuid
                            },
                            include :{
                                specialty : true,
                                suggestedCategory : true
                            },
                            
                        
                    });
        
                     return {
                        status : 200,
                        data : getData
                    }
        
                }
        
        
        
                 async selectSpeciality(dto:ClinicSpecialityUpdateDto) {
                
                        const createData = await this.prisma.clinicSpecialty.create({
                            data :{
                                clinicUuid : dto.clinicUuid!,
                                specialtyId : dto.specialtyId
                            }
                        });
        
                        return {
                          status : 201,
                          message : "Specilization selected successfully"
                        }
                    }
        
        
                     async deleteSpecilaity(dto: ClinicSpecialityUpdateDto) {
                              const deleted = await this.prisma.clinicSpecialty.delete({
                                where: {
                                 id : dto.id
                                },
                              });
                    
                              return {
                                status: 200,
                                message: "Delete successfully",
                              };
                        }
        
        
        
        
                        async createOther(dto: ClinicSpecialityUpdateDto) {
                                    console.log("etstse",dto);
                                
                                  const newRequest = await this.prisma.specializationRequest.create({
                                    data: {
                                      name: String(dto.othertext),
                                      type: SuggestedType.Specialty,
                                      status: SuggestedCategoryStatus.Pending,
                                    },
                                  });
                        
                                 
                                 const doctorSpecialization = await this.prisma.clinicSpecialty.create({
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