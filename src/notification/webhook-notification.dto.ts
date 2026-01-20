import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';

export enum NotificationType {
  PATIENT_QUERY = 'PATIENT_QUERY',
  PAYMENT = 'PAYMENT',
  STATUS_UPDATE = 'STATUS_UPDATE',
}

export class WebhookNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;



  @IsString()
  @IsOptional()
  area: string;

  @IsOptional()
  @IsString()
  id?: string;

  
}



