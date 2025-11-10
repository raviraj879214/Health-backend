import { Injectable } from "@nestjs/common";
import { IPurchasedPackagesServices } from "../interface/purchasedpackages.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";
import { PurchasedPackagesBusiness } from "./business/purchasedpackages.business";




@Injectable()
export class PurchasedPackagesService implements IPurchasedPackagesServices{

    constructor(
        private readonly prisma:PrismaService,
        private readonly activityLogService: ActivityLogService,
        private readonly purchasedpackagesBusiness : PurchasedPackagesBusiness
    ){}



async getPurchasedPackages(page: number, limit: number) {
  // 1️⃣ Total count of all orders
  const totalCount = await this.prisma.clinicListingOrder.count();

  // 2️⃣ Fetch paginated orders with clinic and package details
  const orders = await this.prisma.clinicListingOrder.findMany({
    select: {
      id: true,
      cliniclistingorder: true,
      startDate: true,
      endDate: true,
      status: true,
      amount: true,
      clinic: {
        select: {
          id: true,
          clinic_code: true,
          name: true,
          email: true,
          phone: true,
          address: true,
        }
      },
      package: {
        select: {
          id: true,
          name: true,
          price: true,
          durationDays: true,
        }
      }
    },
    orderBy: {
      id: 'asc',
    },
    skip: (page - 1) * limit, // pagination
    take: limit,
  });

  // 3️⃣ Return response
  return {
    status: 200,
    message: 'Fetched successfully',
    data: orders,
    totalCount,
  };
}





}