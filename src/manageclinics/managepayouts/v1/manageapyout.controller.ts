import { Body, Controller, Get, Inject, Param, Post, Req, UseGuards, Version } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";
import { MANAGE_PAYOUT_CONSTATNT } from "../constant/manageapyout.constant";
import { ManagePayoutServices } from "./manageapyout.service";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { ManagePayoutUpdateDto } from "./dto/manageapyout.update.dto";
import type { AuthRequest } from "src/common/decorators/auth-request.interface";





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





    //23-01-2026

    @Get("payout-patient-query")
    @Version("1")
    @ModuleAccess("Manage Payout")
    async payoutPatientQuery(@Req() request: AuthRequest){
        console.log("executed",request.user?.sub);
        return await this.managePayoutServices.getPatientQuery(Number(request.user?.sub));
    }


    @Get("patient-query-transaction/:patientqueryid")
    @Version("1")
    @ModuleAccess("Manage Payout")
    async payoutPatientQueryTransaction(@Req() request: AuthRequest,@Param("patientqueryid") patientqueryid:string){
        console.log("executed",request.user?.sub);

        return await this.managePayoutServices.getPatinetQueryTransaction(patientqueryid);
    }


    @Post("release-fund")
    @Version("1")
    @ModuleAccess("Manage Payout")
    async releaseFund(@Body() dto:{verndoraccountid:string,patientqueryid:string,note:string,amount:string}){
        
        return await this.managePayoutServices.releaseFundVendor(dto.verndoraccountid,dto.patientqueryid,dto.note,dto.amount);
    }















}