import { Injectable, Logger } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { WebhookNotificationDto } from './webhook-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class NotificationService {



  constructor(
    private readonly notificationGateway: NotificationGateway,
    private readonly prisma : PrismaService
  ) {}


async handleIncomingNotification(payload: WebhookNotificationDto) {

  let alteredPayload: WebhookNotificationDto = { ...payload };


  if (payload.area === "admin") {
    const superAdminRole = "SuperAdmin";

    const superAdmin = await this.prisma.user.findFirst({
      where: {
        role: { name: superAdminRole },
      },
    });

    if (!superAdmin) {
      throw new Error("No SuperAdmin found");
    }

    alteredPayload = {
      ...payload,
      id: String(superAdmin.id),
    };

  }
  else if(payload.area == "clinic"){

    alteredPayload = {
      ...payload,
      id: String(payload.id),
    };
    
  }
  

 
  const newNotification = await this.prisma.notification.create({
    data: {
      message: alteredPayload.message,
      type: alteredPayload.title,
      isRead: false,
      globaluserid: alteredPayload.id,
    },
  });


  const allNotifications = await this.prisma.notification.findMany({
    where:{
      isRead : false
    },
    orderBy: { createdAt: "desc" },
  });


  this.notificationGateway.sendNotification(allNotifications);

  return {
    success: true,
    notification: newNotification,
  };

}



async getNotifications(id:string){

  const getData = await this.prisma.notification.findMany({
    where:{
      globaluserid : id,
      isRead : false
    },
    orderBy:{
      createdAt : "desc"
    }
  });


  return{
    data : getData,
    status : 200
  }

}

async markAsRead(id:string){
  
  const update = await this.prisma.notification.update({
    where:{
      id : Number(id)
    },
    data:{
      isRead : true
    }
  });

  return{
    status : 200
  }
}




}
