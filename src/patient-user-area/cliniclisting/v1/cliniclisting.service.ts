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
                        endAt: {
                            gt: new Date(),
                        },
                        
                    },
                   
                    include: {
                        boostPackage: true,
                    },
                },
                country: true,
                city: true,
            },
             skip: dto.skip,
                    take: dto.limit,
        });


        const formatted = clinics
            .map((clinic) => ({
                ...clinic,
                boosts: clinic.cliniclistingboosts.map((b) => ({
                    boostId: b.boostPackage.id,
                    boostName: b.boostPackage.name,
                    startAt: b.startAt,
                    endAt: b.endAt,
                })),
            }))
            .sort((a, b) => {
               
                if (a.boosts.length && !b.boosts.length) return -1;
                if (!a.boosts.length && b.boosts.length) return 1;
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







    
}