import { Controller, Get, Inject, Query, UseGuards, Version } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";
import { ReportService } from "./report.service";
import { REPORTCONSTANT } from "../constant/report.constant";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";




@Controller("/api/report")
@UseGuards(RolesGuard)
export class ReportController{
  constructor(@Inject(REPORTCONSTANT) private readonly reportService:ReportService){}



@Get("get-transaction")
@ModuleAccess("Manage Report")
@Version("1")
async getTransaction(@Query("startingAfter") startingAfter?: string) {
  return await this.reportService.getStripeTransaction(startingAfter);
} 



@Get("get-patient-query-codes")
@ModuleAccess("Manage Report")
@Version("1")
async getPatientQueryCodes() {

  
  return await this.reportService.getPatientQueryCodes();
} 










}