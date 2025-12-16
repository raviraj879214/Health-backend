import { Body, Controller, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
import { DOCTOR_ADDRESS_CONSTANT_SERVICE } from "../constant/doctoradress.constant";
import { DoctorAddressServices } from "./doctoradress.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { DoctorAddressCreateDto } from "./dto/doctoradress.create.dto";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';


@Controller("/api/doctor-address")
export class ClinicDoctorAddressController{
    constructor(@Inject(DOCTOR_ADDRESS_CONSTANT_SERVICE)private readonly clinicdoctorAddressServices:DoctorAddressServices,
    private readonly httpService: HttpService){}


    @UseGuards(JwtAuthGuard)
    @Post("/create-address")
    @Version("1")
    async createDoctorAddress(@Body() dto:DoctorAddressCreateDto){


        return this.clinicdoctorAddressServices.createClinicDoctorAddress(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Get("/get-address-viacep/:zipcode")
    @Version("1")
    async getAddressViacep(@Param("zipcode") zipcode: string) {
        const url = `${process.env.VIACEP_URL}/${zipcode}/json/`;
            try {
                const response = await firstValueFrom(this.httpService.get(url));
                const data = response.data;
                if (!data || data.erro) {
                    return { result: false };
                }
                return data;
                } catch (error) {
                    return { result: false };
                }
        }











}