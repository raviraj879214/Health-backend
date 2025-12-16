import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IManagePackageSpecialization } from "../interface/packagesteptwo.interface";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";
import { PackageSpecializationUpdateDto } from "./dto/packagesteptwo.update.dto";




@Injectable()
export class ManagePackageSpecializationsServices implements IManagePackageSpecialization{

        constructor(private readonly prisma:PrismaService){}


        async getSpecializations() {
            
            const getData = await this.prisma.specialization.findMany({});
            

            return {
                status : 200,
                data : getData
            }
        }


        async getPackageSpecializations(packageid:string) {

            console.log("packageid",packageid);

            const getData = await this.prisma.packageSpecialization.findMany({
                    where :{
                        packageId : packageid
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



         async selectSpecialization(dto:PackageSpecializationUpdateDto) {
        
                const createData = await this.prisma.packageSpecialization.create({
                    data :{
                        packageId : dto.packageId,
                        specializationId : dto.specializationId
                    }
                });

                return {
                  status : 201,
                  message : "Specilization selected successfully"
                }
            }


             async deleteSpecilaization(dto: PackageSpecializationUpdateDto) {
                      const deleted = await this.prisma.packageSpecialization.delete({
                        where: {
                         id : dto.packageId
                        },
                      });
            
                      return {
                        status: 200,
                        message: "Delete successfully",
                      };
                }




                async createOther(dto: PackageSpecializationUpdateDto) {
                            
                        
                          const newRequest = await this.prisma.specializationRequest.create({
                            data: {
                              name: String(dto.othertext),
                              type: SuggestedType.Specialization,
                              status: SuggestedCategoryStatus.Pending,
                            },
                          });
                
                         
                         const doctorSpecialization = await this.prisma.packageSpecialization.create({
                            data: {
                              suggestedCategoryId: newRequest.id,
                              packageId: dto.packageId!,
                            }
                          });
                
                          return {
                            status: 200,
                            data: doctorSpecialization,
                            message: "Your submission has been created successfully and is pending admin approval.",
                          };
                 }
                


}