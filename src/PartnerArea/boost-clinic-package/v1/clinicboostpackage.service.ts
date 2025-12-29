import { Injectable } from "@nestjs/common";
import { IClinicBoostPackages } from "../interface/clinicboostpackage.interface";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";








@Injectable()
export class ClinicBoostPackagesListingsServices implements IClinicBoostPackages{
    private stripe: Stripe;
    constructor(private readonly prisma:PrismaService,){
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: "2025-10-29.clover",
        });
    }



   async getBoostPackages() {
        const getData = await this.prisma.boostPackage.findMany({
            
        });
        return {
            status : 200,
            data : getData
        }
    }



    async getClinicListing(clinicuserid: string) {


        
        const getClincs = await this.prisma.clinic.findMany({
            where : {
                clinicUserUuid : clinicuserid
            },
            select :{
                uuid : true
            }
       });

       const existClinicPakcgeid = await this.prisma.clinicListingBoost.findMany({
            where : {
                clinicuserid : clinicuserid,
               isActive : true
            }
        });

        const existclinicpackageuuidarray = existClinicPakcgeid.map((item) => item.clinicId);



        const clinicuuidarray = getClincs.map((item) => item.uuid);


        const getPackageData = await this.prisma.clinic.findMany({
            where :{
                uuid:{
                    in :clinicuuidarray,
                    notIn : existclinicpackageuuidarray
                },
                
               
            }
        });

        return {

            status : 200,
            data : getPackageData,
            clinicuserid : clinicuserid,
            existclinicpackageuuidarray:existclinicpackageuuidarray
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
  endAt.setDate(startAt.getDate() + Number(packageduration)); 


  const existingBoost = await this.prisma.clinicListingBoost.findFirst({
    where: {
      clinicId: clinicpackageid,
      isActive: true,
      endAt: {
        gt: new Date(), 
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

  // ⭐ New boost insertion
  await this.prisma.clinicListingBoost.create({
    data: {
      clinicId: clinicpackageid,
      boostPackageId: boostpackageid,
      clinicuserid: clinicuserid,
      isActive: true,
      startAt: startAt,
      endAt: endAt,
    },
  });

  return {
    status: 201,
    success: true,
    message: "Boost package activated successfully.",
  };


}




async getCurrentClinicPackages(clinicuserid: string) {

        const getData = await this.prisma.clinicListingBoost.findMany({
            where :{
                clinicuserid : clinicuserid
            },
            include:{
                clinics : true,
                boostPackage:true
            },
            orderBy : {
                createdAt : 'desc'
               
            }
            
        });

        return {
            status : 200,
            data : getData
        }

    }







}