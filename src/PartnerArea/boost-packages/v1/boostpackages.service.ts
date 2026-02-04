import { Injectable } from "@nestjs/common";
import { IBoostPackages } from "../interface/boostpackages.interface";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";
import { ClinicStatus } from "src/common/enum/ClinicStatus";


@Injectable()
export class BoostPackagesServices implements IBoostPackages{
    private stripe: Stripe;

    constructor(private readonly prisma:PrismaService,){

        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: "2025-10-29.clover",
        });

    }



    async getBoostPackages() {
        const getData = await this.prisma.boostPackage.findMany({});
        return {
            status : 200,
            data : getData
        }
    }



    async getClinicPackage(clinicuserid: string) {

        const getClincs = await this.prisma.clinic.findMany({
            where: {
                clinicUserUuid: clinicuserid
            },
            select: {
                uuid: true
            }
        });

        const existClinicPakcgeid = await this.prisma.clinicBoost.findMany({
            where: {
                clinicuserid: clinicuserid,
                isActive: true
            }
        });

        const existclinicpackageuuidarray = existClinicPakcgeid.map((item) => item.clinicPackageId);

        const clinicuuidarray = getClincs.map((item) => item.uuid);

        const getPackageData = await this.prisma.clinicPackage.findMany({
            where: {
                clinicId: {
                    in: clinicuuidarray
                },
                id: {
                    notIn: existclinicpackageuuidarray
                }
            }
        });

        const clinics = await this.prisma.clinic.findMany({where:{clinicUserUuid : clinicuserid , status : ClinicStatus.ACTIVE}});

        return {

            status: 200,
            data: getPackageData,
            clinicuserid: clinicuserid,
            clinics:clinics
        }
    }





    async insertClinicBoost(sessionId: string) {

        const sessiondata = await this.stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["payment_intent"],
        });

        if (!sessiondata.metadata) {
            throw new Error(
                "Stripe session has no metadata. Did you forget to send metadata when creating the session?"
            );
        }

        const { clinicpackageid, boostpackageid, clinicuserid, packageduration } =
            sessiondata.metadata;

        const startAt = new Date();
        const endAt = new Date();
        endAt.setDate(startAt.getDate() + Number(packageduration)); // e.g. 30 days

        


        const existingBoost = await this.prisma.clinicBoost.findFirst({
            where: {
                clinicPackageId: clinicpackageid,
                isActive: true,
                endAt: {
                    gt: new Date(), // still active, not expired
                },
            },
        });

        if (existingBoost) {
            return {
                status: 409,
                success: false,
                message: "Boost package already active for this clinic package.",
            };
        }

        const packagedetails = await this.prisma.clinicPackage.findFirst({where:{id : clinicpackageid}});

       
        await this.prisma.clinicBoost.create({
            data: {
                clinicPackageId: clinicpackageid,
                boostPackageId: boostpackageid,
                clinicuserid: clinicuserid,
                isActive: true,
                startAt: startAt,
                endAt: endAt,
                clinicUuid : packagedetails?.clinicId
            },
        });




        return {
            status: 201,
            success: true,
            message: "Boost package activated successfully.",
        };
    }




    async getCurrentClinicPackages(clinicuserid: string) {

        const getData = await this.prisma.clinicBoost.findMany({
            where: {
                clinicuserid: clinicuserid
            },
            include: {
                clinicPackage: true,
                boostPackage: true,
                Clinic : true
            },
            orderBy: {
                createdAt: 'desc'

            }

        });

        return {
            status: 200,
            data: getData
        }

    }







    





}