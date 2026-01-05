import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UniversalNotification } from './businessnotification';


@Module({
  imports: [HttpModule], 
  providers: [UniversalNotification],
  exports: [UniversalNotification], 
})
export class UniversalNotificationnModule {}
