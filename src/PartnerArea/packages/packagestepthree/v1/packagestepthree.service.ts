import { Injectable } from "@nestjs/common";
import { IPackageStepThree } from "../interface/packagestepthree.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { PackageSpecialityUpdateDto } from "./dto/packagestepthree.update.dto";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";





@Injectable()
export class ManagePackageSpecialtyServices implements IPackageStepThree{

    constructor(private readonly prisma:PrismaService){}


           async getSpecialitys() {
                    
                    const getData = await this.prisma.specialty.findMany({});
                    
        
                    return {
                        status : 200,
                        data : getData
                    }
                }
        
        
                async getPackageSpecialitys(packageId:string) {
        
                   
        
                    const getData = await this.prisma.packageSpecialty.findMany({
                            where :{
                                packageid : packageId
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
        
        
        
                 async selectSpeciality(dto:PackageSpecialityUpdateDto) {
                
                        const createData = await this.prisma.packageSpecialty.create({
                            data :{
                                packageid : dto.packageId!,
                                specialtyId : dto.specialtyId
                            }
                        });
        
                        return {
                          status : 201,
                          message : "Specilization selected successfully"
                        }
                    }
        
        
                     async deleteSpecilaity(dto: PackageSpecialityUpdateDto) {
                              const deleted = await this.prisma.packageSpecialty.delete({
                                where: {
                                 id : dto.packageId
                                },
                              });
                    
                              return {
                                status: 200,
                                message: "Delete successfully",
                              };
                        }
        
        
        
        
                        async createOther(dto: PackageSpecialityUpdateDto) {
                                    console.log("etstse",dto);
                                
                                  const newRequest = await this.prisma.specializationRequest.create({
                                    data: {
                                      name: String(dto.othertext),
                                      type: SuggestedType.Specialty,
                                      status: SuggestedCategoryStatus.Pending,
                                    },
                                  });
                        
                                 
                                 const doctorSpecialization = await this.prisma.packageSpecialty.create({
                                    data: {
                                      suggestedCategoryId: newRequest.id,
                                      packageid: dto.packageId!,
                                    }
                                  });
                        
                                  return {
                                    status: 200,
                                    data: doctorSpecialization,
                                    message: "Your submission has been created successfully and is pending admin approval.",
                                  };
                         }

}