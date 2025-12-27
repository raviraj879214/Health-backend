import { Body, Controller, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";
import { MANAGE_PAYOUT_CONSTATNT } from "../constant/manageapyout.constant";
import { ManagePayoutServices } from "./manageapyout.service";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { ManagePayoutUpdateDto } from "./dto/manageapyout.update.dto";





@Controller("/api/manage-payout")
@UseGuards(RolesGuard)
export class ManagePayoutController{
    constructor(@Inject(MANAGE_PAYOUT_CONSTATNT) private readonly managePayoutServices:ManagePayoutServices){}


    @Get("get-stripe-account-details/:accountid")
    @Version("1")
    @ModuleAccess("Manage Payout")
    async getStripeAccountDetails(@Param("accountid") accountid:string){


        return await this.managePayoutServices.getStripeAccountDetails(accountid);
    }

    @Get("get-clinic-list")
    @Version("1")
    @ModuleAccess("Manage Payout")
    async getClinicList(){
        return await this.managePayoutServices.getClinicList();
    }


    @Get("get-clinic-details/:id")
    @Version("1")
    @ModuleAccess("Manage Payout")
    async getClinicdetails(@Param("id") id:string){
        return await this.managePayoutServices.getClinicDetails(id);
    }


    @Post("pay-clinic-payout")
    @Version("1")
    @ModuleAccess("Manage Payout")
    async payClinicPayout(@Body() dto:ManagePayoutUpdateDto){


        console.log(dto);
        return await this.managePayoutServices.payoutClinic(dto);
    }


    @Post("get-transfer-transaction")
    @Version("1")
    @ModuleAccess("Manage Payout")
    async getTranfer(@Body() dto:ManagePayoutUpdateDto){


        console.log(dto);
        return await this.managePayoutServices.getTransferTransaction(dto);
    }
















}