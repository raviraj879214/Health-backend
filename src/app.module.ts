import { Module } from '@nestjs/common';
import { RoleModule } from './roles/roles.module';
import { ModulesModule } from './modules/modules.module';
import { RoleModulesModule } from './role-modules/role-modules.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TestModule } from './test/test.module';
import { EmailtemplateModule } from './emailtemplates/emailtemplate.module';
import { AdminUserModule } from './admin-user-changes/v1/admin-user.module';
import { ActivityModule } from './admin-activities/v1/activity.module';
import { BlogModule } from './blog/v1/blog.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { TagsModule } from './tags/v1/tags,module';
import { SeoModule } from './seo/v1/seo.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationsModule } from './notifications/v1/notifications.module';
import { SpecialtyTypeModule } from './manage-specialities-type/v1/specialty.type.module';
import { SpecialtyModule } from './manage-specialities/v1/specialities.module';
import { CategoryModule } from './manage-category/v1/category.module';
import { PatientModule } from './manage-patients/v1/patients.module';
import { ListingPackageModule } from './manage-listing-packages/v1/listing.module';
import { PaymentModule } from './FrontEndModules/payments/payment.module';
import { PurchasedPackagesModule } from './manage-purchased-package-listing/v1/purchasedpackages.module';
import { ClinicAuthModule } from './PartnerArea/ClinicAuth/v1/clinic.module';
import { ManageClinichModule } from './PartnerArea/Manage-Clinics/v1/manageclinic.module';






@Module({
 imports: [
     ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // actual uploads folder
      serveRoot: '/v1/uploads', // URL prefix
    }),
     ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),
    RoleModule, ModulesModule , RoleModulesModule , UsersModule , AuthModule , TestModule , EmailtemplateModule , AdminUserModule , ActivityModule , BlogModule, TagsModule ,SeoModule , NotificationsModule,SpecialtyTypeModule , SpecialtyModule , CategoryModule  , PatientModule,
    ListingPackageModule , PaymentModule , PurchasedPackagesModule , ClinicAuthModule , ManageClinichModule
  
  
  
  ],
})





export class AppModule {}
