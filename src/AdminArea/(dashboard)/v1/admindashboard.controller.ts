import { Controller, Get, Inject, UseGuards, Version } from "@nestjs/common";
import { ADMINDASHBOARDCONSTANT } from "../constant/admin.constant";
import { AdminDasboardServices } from "./admindashboard.service";
import { RolesGuard } from "src/common/guards/roles.guards";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";









@Controller("/api/admin-dashboard")
@UseGuards(RolesGuard)
export class AdminDashboardController {
    constructor(@Inject(ADMINDASHBOARDCONSTANT) private readonly adminDashboardService:AdminDasboardServices){}



    @Get("admin-dashboard-data")
    @ModuleAccess("Admin Dashboard")
    @Version("1")
    async getAdminDashboardData(){


        return await this.adminDashboardService.getDashboardData();
    }




}