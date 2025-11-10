import { Injectable } from "@nestjs/common";
import { IListingService } from "../interface/listing.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";
import { ListingBusiness } from "./business/listing.business";
import { CreateListingDto } from "./dto/create.listing.dto";
import { UpdateListingDto } from "./dto/update.listing.dto";





@Injectable()
export class ListingService implements IListingService{

        constructor(
            private readonly prisma : PrismaService,
            private readonly activityLogService: ActivityLogService,
            private readonly listingBusiness : ListingBusiness){}


           async createListing(dto: CreateListingDto) {
                this.listingBusiness.createValidate(dto);

                const createListing = await this.prisma.listingPackage.create({
                    data :{
                      name : dto.name,
                      price : Number(dto.price),
                      description : dto.description,
                      durationDays : Number(dto.durationDays),
                      priorityLevel : Number(dto.priorityLevel),
                      isActive : Boolean(dto.isActive)
                    }
                });

                return {
                  status : 200,
                  message : "Package listing is created successfully",
                  data : createListing
                }
           } 





           async updateListing(dto: UpdateListingDto) {
             this.listingBusiness.updateValidate(dto);


             const createListing = await this.prisma.listingPackage.update({
                    where :{
                      id : Number(dto.id)
                    },
                    data :{
                      name : dto.name,
                      price : Number(dto.price),
                      description : dto.description,
                      durationDays : Number(dto.durationDays),
                      priorityLevel : Number(dto.priorityLevel),
                      isActive : Boolean(dto.isActive)
                    }
                });

                return {
                  status : 200,
                  message : "Package listing is updated successfully",
                  data : createListing
                }
           }




           async getListing(page: number, limit: number) {
              const totalCount = await this.prisma.listingPackage.count();
              const getListing = await this.prisma.listingPackage.findMany({
                skip: (page - 1) * limit, 
                take: limit,
              });

              return {
                status : 200,
                message : "Listing fetched successfully",
                data : getListing,
                totalCount
              }
           }




           async deleteListing(id: number) {
              const deletePackageListing = await this.prisma.listingPackage.delete({
                  where :{
                    id : Number (id)

                  }
              });
              return {
                message : "Deleted package successfully",
                data : deletePackageListing
              }
               
           }



           async updatepackageStatus(dto: UpdateListingDto) {

              const updatepackageStatus =await this.prisma.listingPackage.update({
                  where :{
                    id : Number(dto.id)
                  },
                  data :{
                    isActive : dto.isActive
                  }
              });


              return {
                  status : 200,
                  message : "Package listing status updated successfully",
                  data : updatepackageStatus

           }
           
          }



}