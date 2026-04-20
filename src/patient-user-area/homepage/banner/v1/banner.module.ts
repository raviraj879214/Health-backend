import { Module } from "@nestjs/common";
import { HomepageBannerController } from "./banner.controller";
import { HOMEPAGE_BANNER_CONSTANT } from "../constant/banner.constant";
import { HomePageBannerServices } from "./banner.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { HttpModule } from "@nestjs/axios";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { UrlGeneratorService } from "src/common/urlgenerator/UrlGenerate";






@Module({
    imports:[HttpModule],
    controllers :[HomepageBannerController],
    providers:[
            {
                provide : HOMEPAGE_BANNER_CONSTANT,
                useClass : HomePageBannerServices
            },
            PrismaService,
            JwtAuthGuard,
            UniversalNotification,
            UrlGeneratorService
    ],
    exports :[HOMEPAGE_BANNER_CONSTANT]
})

export class HomePageBannerModule{}
