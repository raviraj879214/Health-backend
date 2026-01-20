import { Injectable } from "@nestjs/common";
import { IHomePageBanner } from "../interface/banner.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { BannerCreateClinicDto } from "./dto/banner.create.dto";
import { take } from "rxjs";
import { ClinicStatus } from "src/common/enum/ClinicStatus";








@Injectable()
export class HomePageBannerServices implements IHomePageBanner{
    constructor(private readonly prisma:PrismaService){}



    async getSpecialization(limit:number) {
        const getData = await this.prisma.specialization.findMany({
           include: {
                _count: {
                select: {
                    clinics: true,
                },
                },
            },
            ...(Number(limit) > 0 && { take: Number(limit) }),
        });



        return {
            status : 200,
            data :getData
        }
    }

    async getSpecialty() {
        const getData = await this.prisma.specialty.findMany({
            include: {
                _count: {
                select: {
                    clinicsSpecialty: true,
                },
                },
            },
        });

         return {
            status : 200,
            data :getData
        }

    }

   async getTreatmetnt(isFeatured?: string) {
  const where: any = {};

  if (isFeatured?.toLowerCase() === 'true') {
    where.isFeatured = true;
  }

  const getData = await this.prisma.treatment.findMany({
    where,
    include: {
      _count: {
        select: {
          clinicTreatments: true,
        },
      },
    },
  });

  return {
    status: 200,
    data: getData,
  };
}





// ---------- SHUFFLE UTILITY ----------


async getTopRatedClinicListing(dto: BannerCreateClinicDto) {
  const shuffle = (arr: any[]) => arr.sort(() => Math.random() - 0.5);
  const clinicUuids = new Set<string>();



  // ---------- FILTERS ----------
  if (dto.specialization?.length) {
    const ids = dto.specialization.map(s => s.id.toString());
    const data = await this.prisma.clinicSpecialization.findMany({
      where: { specializationId: { in: ids } },
    });
    data.forEach(i => clinicUuids.add(i.clinicUuid));
  }

  if (dto.specialty?.length) {
    const ids = dto.specialty.map(s => s.id.toString());
    const data = await this.prisma.clinicSpecialty.findMany({
      where: { specialtyId: { in: ids } },
    });
    data.forEach(i => clinicUuids.add(i.clinicUuid));
  }

  if (dto.treatment?.length) {
    const ids = dto.treatment.map(s => s.id.toString());
    const data = await this.prisma.clinicTreatment.findMany({
      where: { treatmentid: { in: ids } },
    });
    data.forEach(i => clinicUuids.add(i.clinicUuid));
  }



  const whereClause: any = {
    status : ClinicStatus.ACTIVE,
    isActive: true,
    ...(clinicUuids.size > 0 && { uuid: { in: [...clinicUuids] } }),
  };


  // ---------- FETCH CLINICS ----------
  const clinics = await this.prisma.clinic.findMany({
    where: whereClause,
    include: {
      cliniclistingboosts: {
        where: { isActive: true, endAt: { gt: new Date() } },
        include: { boostPackage: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      ratingSummary: true,
      country: true,
      city: true,
      packages: true,
    },
  });

  // ---------- CLASSIFY CLINICS ----------
  const topRated: any[] = [];
  const popular: any[] = [];
  const mainListing: any[] = [];
  const normal: any[] = [];

  clinics.forEach(clinic => {
    const boost = clinic.cliniclistingboosts[0];
    const rating = Number(clinic.ratingSummary?.averageRating || 0);
    const placement = boost?.boostPackage?.placement ?? null;

    const item = { ...clinic, _rating: rating, _placement: placement };

    switch (placement) {
      case 1:
        topRated.push(item);
        break;
      case 0:
        popular.push(item);
        break;
      case 2:
        mainListing.push(item);
        break;
      default:
        normal.push(item);
    }
  });

  // ---------- SHUFFLE WITHIN BUCKET ----------
  shuffle(topRated);
  shuffle(popular);
  shuffle(mainListing);
  normal.sort((a, b) => b._rating - a._rating + (Math.random() - 0.5));

  // ---------- FINAL LIST ----------
  const finalList = [...topRated, ...popular, ...mainListing, ...normal];

  // ---------- PAGINATION ----------
  const skip = dto.skip ?? 0;
  const limit = dto.limit ?? finalList.length;
  const paginated = finalList.slice(skip, skip + limit);

  const clinicImages = await this.prisma.clinicImages.findMany({
    where: { clinicuuid: { in: paginated.map(c => c.uuid) } },
  });

  return {
    data: paginated,
    clinicImages,
    total: finalList.length,
    skip,
    limit,
  };
}



async getPopularClinicListing(dto: BannerCreateClinicDto) {
  // ---------- FISHER–YATES SHUFFLE ----------
  const shuffle = (arr: any[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const clinicUuids = new Set<string>();

  // ---------- FILTERS ----------
  if (dto.specialization?.length) {
    const ids = dto.specialization.map(s => s.id.toString());
    const data = await this.prisma.clinicSpecialization.findMany({
      where: { specializationId: { in: ids } },
    });
    data.forEach(i => clinicUuids.add(i.clinicUuid));
  }

  if (dto.specialty?.length) {
    const ids = dto.specialty.map(s => s.id.toString());
    const data = await this.prisma.clinicSpecialty.findMany({
      where: { specialtyId: { in: ids } },
    });
    data.forEach(i => clinicUuids.add(i.clinicUuid));
  }

  if (dto.treatment?.length) {
    const ids = dto.treatment.map(s => s.id.toString());
    const data = await this.prisma.clinicTreatment.findMany({
      where: { treatmentid: { in: ids } },
    });
    data.forEach(i => clinicUuids.add(i.clinicUuid));
  }

  const whereClause: any = {
    status : ClinicStatus.ACTIVE,
    isActive: true,
    ...(clinicUuids.size && { uuid: { in: [...clinicUuids] } }),
  };

  const clinics = await this.prisma.clinic.findMany({
    where: whereClause,
    include: {
      cliniclistingboosts: {
        where: { isActive: true, endAt: { gt: new Date() } },
        include: { boostPackage: true },
      },
      ratingSummary: true,
      country: true,
      city: true,
      packages: true,
    },
  });

  // ---------- CLASSIFY CLINICS ----------
  const topRated: any[] = [];
  const popular: any[] = [];
  const mainListing: any[] = [];
  const normal: any[] = [];

  clinics.forEach(clinic => {
    const boost = clinic.cliniclistingboosts[0];
    const rating = Number(clinic.ratingSummary?.averageRating || 0);
    const placement = boost?.boostPackage?.placement ?? null;

    const item = { ...clinic, _rating: rating, _placement: placement };

    switch (placement) {
      case 0:
        popular.push(item);
        break;
      case 1:
        topRated.push(item);
        break;
      case 2:
        mainListing.push(item);
        break;
      default:
        normal.push(item);
    }
  });

  // ---------- SHUFFLE WITHIN BUCKET ----------
  shuffle(popular);
  shuffle(topRated);
  shuffle(mainListing);
  // Normal sorted by rating + minor randomness
  normal.sort((a, b) => b._rating - a._rating + (Math.random() - 0.5));

  const finalList = [...popular, ...topRated, ...mainListing, ...normal];

  const skip = dto.skip ?? 0;
  const limit = dto.limit ?? finalList.length;
  const paginated = finalList.slice(skip, skip + limit);

  const clinicImages = await this.prisma.clinicImages.findMany({
    where: { clinicuuid: { in: paginated.map(c => c.uuid) } },
  });

  return {
    data: paginated,
    clinicImages,
    total: finalList.length,
    skip,
    limit,
  };
}



    async getPlaces() {
        const getPlaces = await this.prisma.clinic.findMany({
          where:{
            citycep : {
              notIn : null
            }
          },
          select:{
            citycep : true
          }
        });

        return{
          status : 200,
          data : getPlaces
        }
    }











}