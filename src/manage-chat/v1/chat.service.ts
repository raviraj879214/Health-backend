import { Injectable } from "@nestjs/common";
import { IChatService } from "../interace/chat.interface";
import { PrismaService } from "src/prisma/prisma.service";



@Injectable()
export class ChatServices implements IChatService {
    constructor(private readonly prisma:PrismaService){}

    
    async getChatUserlist() {

        const clinics = await this.prisma.clinics.findMany({});

        return {
            message : "Get chat users list",
            data : clinics
        }
    }


async getChatMessages(senderid: number, receiver: number) {
  const getchatlist = await this.prisma.chat.findMany({
    where: {
      OR: [
        { sender_id: Number(senderid), receiver_id: Number(receiver) },
        { sender_id: Number(receiver), receiver_id: Number(senderid) }
      ]
    },
    include: {
      sender: true,
      receiver: true
    },
    orderBy: { created_at: "asc" }
    
  });

  return {
    message: "get messages list",
    data: getchatlist
  };
}










}