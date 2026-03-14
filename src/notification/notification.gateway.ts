import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  sendNotification(payload: any) {
    this.server.emit('notification', payload);
  }


  sendPatientRequest(payload: any) {
    console.log("patientRequest", payload);
    this.server.emit("patientrequest_clinic", payload);
  }


  sendPatientRequestAdmin(payload: any) {
    console.log("patientRequestAdmin", payload);
    this.server.emit("patientRequestAdmin", payload);
  }







}
