import { Controller, Get, Inject, Param, Version } from "@nestjs/common";
import { CHAT_SERVICE_V1 } from "../constant/chat.constant";
import { ChatServices } from "./chat.service";





@Controller("/api/chat")
export class ChatController{

     constructor(@Inject(CHAT_SERVICE_V1) private readonly chatServices : ChatServices) { }


     @Get("/get-user-list")
     @Version("1")
     async getUsersChat(){

          return this.chatServices.getChatUserlist();
     }


    @Get("/get-chat-list/:senderid/:receiverid")
     @Version("1")
     async getChatmessagelist(
     @Param("senderid") senderid: number,
     @Param("receiverid") receiverid: number
     ) {
            return this.chatServices.getChatMessages(senderid, receiverid);
     }






     
}