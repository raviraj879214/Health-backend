import { Injectable } from "@nestjs/common";
import { IClinicListing } from "../interface/cliniclisting.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ClinicListCreateDto } from "./dto/cliniclisting.update.dto";
import { PostQueryCreateDto } from "./dto/cliniclisting.create.dto";
import { ClinicListingBusiness } from "./business/cliniclisting.business.";
import { EmailService } from "src/EmailServices/email.service";
import { Emailenumconsts } from "src/common/emailtemplate/emailenums";
import { EmailTemplate } from "src/common/emailtemplate/email-template";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { ClinicStatus } from "src/common/enum/ClinicStatus";
import { PackageVerifyStatus } from "src/common/enum/packageVerifyStatus";
import { PackageVisibiltyStatus } from "src/common/enum/packageVisibiltyStatus";
import { QueryPaymentStatus } from "src/common/enum/queryPaymentStatus";







@Injectable()
export class ClinicListingServices implements IClinicListing{
    constructor(
        private readonly prisma:PrismaService,
        private readonly clincibusniess:ClinicListingBusiness,
        private emailservice : EmailService,
        private readonly universalNotification:UniversalNotification
    ){}

    


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


        //get places filter starts 

        const placesids: string[] = dto.places.map(s => s.id.toString());
            const clinicuuidsplacesids = await this.prisma.clinic.findMany({
                    where : {
                        citycep :{
                            in : placesids
                        }
                    }
            });
        clinicuuidsplacesids.map((item)=>{
                clinicuuids.push(item.uuid);
        });


        console.log("places clinicuuidsplacesids",clinicuuidsplacesids);

       //specialty ends here 





        const whereClause: any = {
            status : ClinicStatus.ACTIVE
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

        const total = await this.prisma.clinic.count({where: whereClause,});

        const result = await this.prisma.clinicPackage.aggregate({
                _min: {
                    discountedprice: true,
                },
                _max: {
                    discountedprice: true,
                },
                });

                const minPrice = result._min.discountedprice;
                const maxPrice = result._max.discountedprice;



        return (
            {
                data: formatted,
                clinicimages,
                total,
                skip: dto.skip,
                limit: dto.limit,
                minPrice : minPrice,
                maxPrice : maxPrice
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
                packages : {
                    where:{
                        status : PackageVerifyStatus.VERIFIED,
                        Visibilty : PackageVisibiltyStatus.SHOW
                    }
                },
                googleReviews : true,
                clinicDoctors : {
                    include :{
                        doctor : {
                            include : {
                            
                                specializations : {
                                    include:{
                                        specialization : true
                                    }
                                }
                            },
                            
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



    async postQuery(dto: PostQueryCreateDto) {

        // console.log(dto);
        
        if (!dto) {
            throw new Error('Request body is empty or invalid');
        }

        const patientquery = await this.prisma.patientQuery.findFirst({
            orderBy: {
                createdAt: 'desc',
            },
        });


        const patiennewcode = await this.clincibusniess.patientcode(patientquery?.querycode ?? undefined);



       
        const createData = await this.prisma.patientQuery.create({
            data: {
                patientName: dto.patientName || '',
                phoneNumber: dto.phoneNumber || '',
                message: dto.message || '',
                clinicId: (dto.clinicId === "demo-id" ? null : dto.clinicId) || null,
                packageId: dto.packageId || null,
                email: dto.email || '',
                subject: dto.subject || '',
                telegramUsername: dto.telegramUsername || '',
                whatsappNumber: dto.whatsappNumber || '',
                city: dto.city || '',
                postalCode: dto.postalCode || '',
                state: dto.state || '',
                streetAddress: dto.streetAddress || '',
                querycode: patiennewcode,
                whatMatterMostName : dto.whatMatterMostName,
                medicalReportsValue: dto.medicalReportsValue,
                treatmentName : dto.treatmentName,
                procedureTimeValue:dto.procedureTimeValue,
                cordinatorid : Number(dto.cordinatorid || 0),
                PaymentStatus : String(QueryPaymentStatus.UNPAID)
            }
        });














        if(createData.email){
            const emailText = `We’ve received your query. Our coordinator will go through it and contact you shortly. Please hold on for a bit. Your query code is ${createData.querycode}.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    createData.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `Query submitted successfully` +"-" + createData.querycode,  
                    "",            
                    htmlContent  
            );
        }




        //admin email 
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});
            const emailText = `A new query has been received from a patient. Please log in to the dashboard to review the query. Query Code: ${createData.querycode}.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                   adminemail?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `New Query Received Successfully` +"-" + createData.querycode,  
                    "",            
                    htmlContent  
            );
        //end

        //cordinator email

            const cordinatoremail = await this.prisma.user.findFirst({where :{id : Number(dto.cordinatorid)},select:{email : true}});
            const cordinatoremailText = `A new query has been received from a patient. Please log in to the dashboard to review the query. Query Code: ${createData.querycode}.`;
            const cordinatorhtmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                   cordinatoremail?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `New Query Received Successfully` +"-" + createData.querycode,  
                    "",            
                    cordinatorhtmlContent  
            );

        //end






        let payload : WebhookNotificationDto = {
            title : "New Query Received Successfully",
            area: "admin",
            message : `New Query received from patients ${createData?.querycode}` ,
        }
        await this.universalNotification.HandleNotification(payload);

        let payloadcordinator : WebhookNotificationDto = {
            title : "New Query Received Successfully",
            area: "",
            id : dto.cordinatorid,
            message : `New Query received from patients ${createData?.querycode}` ,
        }
        await this.universalNotification.HandleNotification(payloadcordinator);





        return {
            status: 201,
            data: createData
        };
    }





    




    
}