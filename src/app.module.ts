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
import { CategoryModule } from './manage-category/v1/category.module';
import { PatientModule } from './manage-patients/v1/patients.module';
import { ListingPackageModule } from './manage-listing-packages/v1/listing.module';
import { PaymentModule } from './FrontEndModules/payments/payment.module';
import { PurchasedPackagesModule } from './manage-purchased-package-listing/v1/purchasedpackages.module';
import { ClinicAuthModule } from './PartnerArea/ClinicAuth/v1/clinic.module';
import { ManageClinichModule } from './PartnerArea/Manage-Clinics/v1/manageclinic.module';
import { ManageSurgeriesModule } from './PartnerArea/manage-surgeries/v1/managesurgeries.module';
import { ManageBannerModule } from './PartnerArea/manage-banner-images/v1/managebanner.module';
import { Accreditations } from './PartnerArea/manage-accreditation/v1/accreditation.module';
import { EmailModule } from './EmailServices/email.module';
import { ClinicDescriptionModule } from './PartnerArea/clinic-description/v1/clinicdescription.module';
import { DoctorModule } from './PartnerArea/add-doctors/v1/doctor.module';
import { DoctorSpecilizationModule } from './PartnerArea/doctor-specialization/v1/doctorspecialization.module';
import { DoctorSpecialty } from './PartnerArea/doctor-specialty/v1/doctorspecialty.module';
import { DoctorTreatment } from './PartnerArea/doctor-treatment/v1/doctortreatment.module';
import { DoctorDecription } from './PartnerArea/doctor-description/v1/doctordescription.module';
import { ClinicDoctorAddressModule } from './PartnerArea/doctor-address/v1/doctoradress.module';
import { ManageClinicSpecializationModule } from './PartnerArea/managespecializationspecialtytreatment/manage-specialization/v1/managespecialization.module';
import { ManageClinicSpecialityModule } from './PartnerArea/managespecializationspecialtytreatment/manage-specialty/v1/managespecialty.module';
import { ManageClinicTreatmentModule } from './PartnerArea/managespecializationspecialtytreatment/manage-treatment/v1/managetreatment.module';
import { BoostPackagesModule } from './PartnerArea/boost-packages/v1/boostpackages.module';
import { PackageStepOneModule } from './PartnerArea/packages/packagestepone/v1/packagestepone.module';
import { ManagePackageSpecializationModule } from './PartnerArea/packages/packagesteptwo/v1/packagesteptwo.module';
import { ManagePackageSpecialityModule } from './PartnerArea/packages/packagestepthree/v1/packagestepthree.module';
import { ManagePackageTreatmentModule } from './PartnerArea/packages/packagestepfour/v1/packagestepfour.module';
import { ManagePackageProcedureModule } from './PartnerArea/packages/packagestepfive/v1/packagestepfive.module';
import { PackageStepSixModule } from './PartnerArea/packages/packagestepsix/v1/packagestepsix.module';
import { ManagePackageDoctorModule } from './PartnerArea/packages/packagestepseven/v1/packagestepfive.module';
import { PartnerRegisterModule } from './PartnerArea/partnerRegister/v1/partnerregister.module';
import { ManageClinicModule } from './manageclinics/manage-clinics/v1/manageclinic.module';
import { ManageDoctorModule } from './manageclinics/managedoctors/v1/managedoctor.module';
import { ManagePatietnQueriesModule } from './patientqueries/v1/patientqueries.module';
import { StripeConnectModule } from './PartnerArea/stripe-connect/v1/stripeconnect.module';
import { ManagePayoutModule } from './manageclinics/managepayouts/v1/manageapyout.module';








@Module({
 imports: [
     ServeStaticModule.forRoot({
     rootPath: join(__dirname, '..', '..', 'uploads'),
    serveRoot: '/v1/uploads',
    }),
     ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),

    
    
    RoleModule, ModulesModule , RoleModulesModule , UsersModule , AuthModule , TestModule , EmailtemplateModule , AdminUserModule , ActivityModule , BlogModule, TagsModule ,SeoModule , NotificationsModule, CategoryModule  , PatientModule,
    ListingPackageModule , PaymentModule , PurchasedPackagesModule , ClinicAuthModule , ManageClinichModule , ManageSurgeriesModule,ManageBannerModule,Accreditations,EmailModule,ClinicDescriptionModule , DoctorModule , DoctorSpecilizationModule,DoctorSpecialty,
    DoctorTreatment ,DoctorDecription , ClinicDoctorAddressModule , ManageClinicSpecializationModule , ManageClinicSpecialityModule , ManageClinicTreatmentModule,BoostPackagesModule,
    PackageStepOneModule , ManagePackageSpecializationModule ,ManagePackageSpecialityModule , ManagePackageTreatmentModule ,ManagePackageProcedureModule,PackageStepSixModule,ManagePackageDoctorModule,PartnerRegisterModule,ManageClinicModule ,ManageDoctorModule,
    ManagePatietnQueriesModule,StripeConnectModule,ManagePayoutModule
    
  ],
  
})





export class AppModule {}
