import { Injectable } from "@nestjs/common";
import { IPackageStepFiveServices } from "../interface/packagestepfive.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { PackageStepDoctorUpdateDto } from "./dto/packagestepfive.update.dto";







@Injectable()
export class ManagePackageDoctorServices implements IPackageStepFiveServices {

    constructor(private readonly prisma: PrismaService) { }


    async getSelectedDoctor(packageid: string) {

        const  getData = await this.prisma.packageDoctor.findFirst({
            where :{
                packageId : packageid
            },
            include:{
                doctors : true
            }
        });
        return {
            status : 200,
            data : getData
        }
    }


    async selectDoctor(dto: PackageStepDoctorUpdateDto) {

        const existcheck = await this.prisma.packageDoctor.findFirst({
            where: { packageId: dto.packageId }
        })
        
        if (existcheck) {

            const update = await this.prisma.packageDoctor.update({
                where: {
                    id: existcheck.id,
                },
                data: {
                    doctorId: dto.doctorId
                }
            });
            return {
                status: 200,
                message: "Doctor selected successgully",
                data: update

            }
        }
        else {
            const create = await this.prisma.packageDoctor.create({
                data: {
                    packageId: dto.packageId,
                    doctorId: dto.doctorId
                }
            });

            return {
                status: 200,
                message: "Doctor selected successgully",
                data: create
            }

        }

    }






}