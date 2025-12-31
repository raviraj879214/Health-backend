import { Injectable } from "@nestjs/common";
import { IClinicListing } from "../interface/cliniclisting.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ClinicListCreateDto } from "./dto/cliniclisting.update.dto";





@Injectable()
export class ClinicListingServices implements IClinicListing{
    constructor(private readonly prisma:PrismaService){}

    


    async getClinicList(dto:ClinicListCreateDto) {

       

       let clinicuuids: string[] = [];



        //get specialization filter
       const specializationIds: string[] = dto.specialization.map(s => s.id.toString());
       const clinicuuidsspecializationids = await this.prisma.clinicSpecialization.findMany({
            where : {
                specializationId :{
                    in : specializationIds
                }
            }
       });
       clinicuuidsspecializationids.map((item)=>{
            clinicuuids.push(item.clinicUuid);
       });
       //specialization filter ends here

       

       //get specialty filter starts 

        const specialtyIds: string[] = dto.specialty.map(s => s.id.toString());
            const clinicuuidsspecialtyids = await this.prisma.clinicSpecialty.findMany({
                    where : {
                        specialtyId :{
                            in : specialtyIds
                        }
                    }
            });
        clinicuuidsspecialtyids.map((item)=>{
                clinicuuids.push(item.clinicUuid);
        });

       //specialty ends here 


        //get treatment filter starts 

        const treatmentIds: string[] = dto.treatment.map(s => s.id.toString());
            const clinicuuidstreatmentids = await this.prisma.clinicTreatment.findMany({
                    where : {
                        treatmentid :{
                            in : treatmentIds
                        }
                    }
            });
        clinicuuidstreatmentids.map((item)=>{
                clinicuuids.push(item.clinicUuid);
        });

       //specialty ends here 





        const whereClause: any = {
            isActive: true,
        };

      
        if (dto.specialization.length > 0) {
            whereClause.uuid = {
                in: clinicuuids,
            };
        }
        if (dto.specialty.length > 0) {
            whereClause.uuid = {
                in: clinicuuids,
            };
        }
        if (dto.treatment.length > 0) {
            whereClause.uuid = {
                in: clinicuuids,
            };
        }


      const clinics = await this.prisma.clinic.findMany({
  where: whereClause,
  include: {
    cliniclistingboosts: {
      where: {
        isActive: true,
        endAt: { gt: new Date() },
      },
      include: {
        boostPackage: true, // no priority needed
      },
    },
    country: true,
    city: true,
    ratingSummary: true,
    packages :true
  },
  skip: dto.skip,
  take: dto.limit,
});

const formatted = clinics
  .map((clinic) => {
    const boosts = clinic.cliniclistingboosts;
    const isBoosted = boosts.length > 0;

    const rating = clinic.ratingSummary?.averageRating
      ? Number(clinic.ratingSummary.averageRating)
      : 0;

    return {
      ...clinic,
      boosts: boosts.map(b => ({
        boostId: b.boostPackage.id,
        boostName: b.boostPackage.name,
        startAt: b.startAt,
        endAt: b.endAt,
      })),
      _isBoosted: isBoosted,
      _rating: rating,
    };
  })
  .sort((a, b) => {
    // 1️⃣ Boosted clinics first
    if (a._isBoosted && !b._isBoosted) return -1;
    if (!a._isBoosted && b._isBoosted) return 1;

    // 2️⃣ Ratings >= 3 first, low ratings at bottom
    const aLow = a._rating < 3 ? 1 : 0;
    const bLow = b._rating < 3 ? 1 : 0;
    if (aLow !== bLow) return aLow - bLow;

    // 3️⃣ Sort by rating DESC within boosted/normal and high-rated
    if (b._rating !== a._rating) return b._rating - a._rating;

    // 4️⃣ Random order for same rating
    return Math.random() - 0.5;
  });


            

            const clinicuuid = formatted.map((item)=> item.uuid);

            const clinicimages = await this.prisma.clinicImages.findMany({
                where : {
                    clinicuuid : {
                        in : clinicuuid
                    }
                }
            });

            const total = await this.prisma.clinic.count({
                where: whereClause,
                });


            return (
           {
            data: formatted,
            clinicimages,
            total,       
            skip: dto.skip,
            limit: dto.limit
            }
        );


    }



    async getClinicDetails(clinicId: string) {


        const getClinicDetails = await this.prisma.clinic.findUnique({
            where :{
                uuid : clinicId
            },
            include:{
                city : true,
                country : true,
                ratingSummary : true,
                packages : true,
                googleReviews : true,
                
                clinicDoctors : {
                    include :{
                        doctor :{
                            include :{
                                specializations : {
                                    include:{
                                        specialization : true
                                    }
                                }
                            }
                        }
                    }
                },
                
            }
        });

        
        const clinicImges = await this.prisma.clinicImages.findMany({
            where :{
                clinicuuid : getClinicDetails?.uuid
            }
        });

        const description = await this.prisma.clinicDescription.findFirst({
            where: {
                clinicuuid: getClinicDetails?.uuid,
            },
        });

        const surgeryimages = await this.prisma.clinicSurgeryImage.findMany({
            where :{
                clinicUuid : getClinicDetails?.uuid
            }
        });


        const accreditaions = await this.prisma.clinicAccreditation.findMany({
            where:{
                clinicuuid : clinicId
            },
            include:{
                accreditation :true
            }
        })


        


        return{
            status : 200,
            data : getClinicDetails,
            bannerimages : clinicImges,
            description:description,
            surgeryimages : surgeryimages,
            accreditaions:accreditaions
        }

        
    }




    async getGoogleReviews(clinicId: string) {
        
        const data = await this.prisma.googleReview.findMany({
            where :{
                clinicUuid : clinicId
            }
        });

        return {
            status: 200,
            data : data
        }
    }






    
}