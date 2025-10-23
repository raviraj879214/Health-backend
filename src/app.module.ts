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
    RoleModule, ModulesModule , RoleModulesModule , UsersModule , AuthModule , TestModule , EmailtemplateModule , AdminUserModule , ActivityModule , BlogModule, TagsModule ,SeoModule , NotificationsModule ],
})





export class AppModule {}
