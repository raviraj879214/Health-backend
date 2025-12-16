import { Injectable } from "@nestjs/common";
import { IPackageStepFiveServices } from "../interface/packagestepfive.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { PackageStepFiveUpdateDto } from "./dto/packagestepfive.update.dto";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";











@Injectable()
export class ManagePackageProcedureServices implements IPackageStepFiveServices {

    constructor(private readonly prisma: PrismaService) { }



    async getProcedure() {

        const getData = await this.prisma.procedure.findMany({});


        return {
            status: 200,
            data: getData
        }
    }


    async getPackageProcedure(packageid:string) {



        const getData = await this.prisma.packageProcedure.findMany({
            where: {
                packageId: packageid
            },
            include: {
                procedure: true,
                suggestedCategory: true
            },


        });

        return {
            status: 200,
            data: getData
        }

    }


    async selectProcedure(dto: PackageStepFiveUpdateDto) {

        const createData = await this.prisma.packageProcedure.create({
            data: {
                packageId: dto.packageid!,
                procedureid : dto.procedureid
            }
        });

        return {
            status: 201,
            message: "Specilization selected successfully"
        }
    }


    async deleteProcedure(dto: PackageStepFiveUpdateDto) {
        const deleted = await this.prisma.packageProcedure.delete({
            where: {
                id: dto.packageid
            },
        });

        return {
            status: 200,
            message: "Delete successfully",
        };
    }




    async createOther(dto: PackageStepFiveUpdateDto) {
       

        const newRequest = await this.prisma.specializationRequest.create({
            data: {
                name: String(dto.othertext),
                type: SuggestedType.Procedure,
                status: SuggestedCategoryStatus.Pending,
            },
        });



        const doctorSpecialization = await this.prisma.packageProcedure.create({
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