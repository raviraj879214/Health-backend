import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { IHomePageBanner } from "../interface/banner.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { BannerCreateClinicDto } from "./dto/banner.create.dto";
import { firstValueFrom, take } from "rxjs";
import { ClinicStatus } from "src/common/enum/ClinicStatus";
import { PackageVisibiltyStatus } from "src/common/enum/packageVisibiltyStatus";
import { PackageVerifyStatus } from "src/common/enum/packageVerifyStatus";
import { Prisma } from "@prisma/client";
import axios from "axios";
import { HttpService } from "@nestjs/axios";








@Injectable()
export class HomePageBannerServices implements IHomePageBanner{
    constructor(
      private readonly prisma:PrismaService,
      private readonly httpService: HttpService
    ){}



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





  async getPackages() {
    const now = new Date();

    const packages = await this.prisma.clinicPackage.findMany({
      include: {
        boosts: {
          where: {
            isActive: true,
            startAt: { lte: now },
            endAt: { gte: now },
          },
        },
        clinic: true,
      },
      where: {
        status: PackageVerifyStatus.VERIFIED,
        Visibilty: PackageVisibiltyStatus.SHOW,
      },
    });

    type PackageWithBoosts = Prisma.ClinicPackageGetPayload<{
      include: { boosts: true; clinic: true };
    }>;

    const boosted: PackageWithBoosts[] = [];
    const normal: PackageWithBoosts[] = [];

    for (const pkg of packages) {
      if (pkg.boosts.length > 0) {
        boosted.push(pkg);
      } else {
        normal.push(pkg);
      }
    }

    const shuffle = <T>(arr: T[]) => arr.sort(() => Math.random() - 0.5);

    return [...shuffle(boosted), ...shuffle(normal)];
  }




  async getGoogleReviews(placeId: string) {
    try {
      const clinics = await this.prisma.clinic.findMany({
        where: { placesid: { not: null } },
        select: { uuid: true, placesid: true },
      });

      await this.prisma.googleReview.deleteMany({});
      for (const clinic of clinics) {
        try {
          const url = `https://maps.googleapis.com/maps/api/place/details/json`;
          const params = {
            place_id: clinic.placesid,
            fields: 'name,rating,user_ratings_total,reviews',
            key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
          };

          const response = await firstValueFrom(
            this.httpService.get(url, { params }),
          );

          const data = response.data;

          if (data.status !== 'OK') {
            console.log(`Skipped clinic ${clinic.uuid} - ${data.status}`);
            continue;
          }

          const result = data.result;
          const averageRating = result.rating || 0;
          const totalReviews = result.user_ratings_total || 0;

          await this.prisma.clinicRatingSummary.upsert({
            where: { clinicUuid: clinic.uuid },
            update: {
              averageRating,
              totalReviews,
              updatedAt: new Date(),
            },
            create: {
              clinicUuid: clinic.uuid,
              averageRating,
              totalReviews,
              updatedAt: new Date(),
            },
          });

          const reviews = result.reviews || [];

          for (const r of reviews) {
            const googleReviewId = r.time?.toString() + '_' + r.author_name; // fallback unique id

            await this.prisma.googleReview.upsert({
              where: { googleReviewId },
              update: {},
              create: {
                clinicUuid: clinic.uuid,
                googleReviewId,
                authorName: r.author_name,
                rating: r.rating,
                comment: r.text,
                reviewTime: new Date(r.time * 1000),
                replyText: r.owner_response?.text || null,
                replyTime: r.owner_response?.time
                  ? new Date(r.owner_response.time * 1000)
                  : null,
              },
            });
          }

        } catch (err) {
          console.log(`Error syncing clinic ${clinic.uuid}`, err.message);
        }
      }

      return { success: true };
    } catch (error: any) {
      throw new HttpException(
        `Failed to sync Google data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }




   async getGooglePlaces(placesid: string) {

      const placeDetailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
      const placeDetailsParams = {
        place_id: placesid,
        fields: 'name,rating,user_ratings_total,formatted_address,photos,opening_hours,types',
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
      };

      const detailsResponse = await firstValueFrom(
        this.httpService.get(placeDetailsUrl, { params: placeDetailsParams }),
      );

      const details = detailsResponse.data.result;

      return {
        place_id: placesid,
        name: details.name,
        address: details.formatted_address,
        rating: details.rating || null,
        total_ratings: details.user_ratings_total || 0,
        photos: details.photos || [],
        opening_hours: details.opening_hours || null,
        types: details.types || [],
      };

  }











}