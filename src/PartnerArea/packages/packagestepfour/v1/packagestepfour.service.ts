import { Injectable } from "@nestjs/common";
import { IPackageStepFourServices } from "../interface/packagestepfour.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { PackageTreatmentUpdateDto } from "./dto/packagestepfour.update.dto";





@Injectable()
export class ManagePackageTreatmentServices implements IPackageStepFourServices {

    constructor(private readonly prisma: PrismaService) { }



    async getTreatments() {

        const getData = await this.prisma.treatment.findMany({});


        return {
            status: 200,
            data: getData
        }
    }


    async getPackageTreatments(packageid:string) {



        const getData = await this.prisma.packageTreatment.findMany({
            where: {
                packageId: packageid
            },
            include: {
                treatment: true,
                suggestedCategory: true
            },


        });

        return {
            status: 200,
            data: getData
        }

    }



    async selectTreatment(dto: PackageTreatmentUpdateDto) {

        const createData = await this.prisma.packageTreatment.create({
            data: {
                packageId: dto.packageid!,
                treatmentid : dto.treatmentid
            }
        });

        return {
            status: 201,
            message: "Specilization selected successfully"
        }
    }


    async deleteTreatments(dto: PackageTreatmentUpdateDto) {
        const deleted = await this.prisma.packageTreatment.delete({
            where: {
                id: dto.packageid
            },
        });

        return {
            status: 200,
            message: "Delete successfully",
        };
    }




    async createOther(dto: PackageTreatmentUpdateDto) {
       

        const newRequest = await this.prisma.specializationRequest.create({
            data: {
                name: String(dto.othertext),
                type: SuggestedType.Treatment,
                status: SuggestedCategoryStatus.Pending,
            },
        });


       



        const doctorSpecialization = await this.prisma.packageTreatment.create({
            data: {
                suggestedCategoryId: newRequest.id,
                packageId: dto.packageid!,
            }
        });

        return {
            status: 200,
            data: doctorSpecialization,
            message: "Your submission has been created successfully and is pending admin approval.",
        };
    }






}