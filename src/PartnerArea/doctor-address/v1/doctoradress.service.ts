import { Injectable } from "@nestjs/common";
import { IDoctorAddressService } from "../interface/doctoradress.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { DoctorAddressCreateDto } from "./dto/doctoradress.create.dto";



@Injectable()
export class DoctorAddressServices implements IDoctorAddressService{

    constructor(private readonly prisma:PrismaService ){}

    async createClinicDoctorAddress(dto: DoctorAddressCreateDto) {

        const createData = await this.prisma.clinicDoctorAddress.create({
            data : {
                clinicUuid : dto.clinicUuid,
                doctorUuid : dto.doctorUuid,
                zipcode : dto.zipcode,
                street : dto.street,
                complement : dto.complement,
                postalUnit : dto.postalUnit,
                neighborhood : dto.neighborhood,
                city : dto.city,
                stateCode : dto.stateCode,
                stateName : dto.stateName,
                region : dto.region,
                ibgeCode : dto.ibgeCode,
                giaCode : dto.giaCode,
                areaCode : dto.areaCode,
                siafiCode : dto.siafiCode
            }
        });


        return {
            status : 201,
            message : "Address added successfully"
        }


    }





}