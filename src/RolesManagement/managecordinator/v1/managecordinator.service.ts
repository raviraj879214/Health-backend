import { Injectable } from "@nestjs/common";
import { IManageCordinator } from "../interface/managecordinator.interface";
import { PrismaService } from "src/prisma/prisma.service";





@Injectable()
export class ManageCordinatorServices implements IManageCordinator{

    constructor(private readonly prisma:PrismaService){}


    async getCordinator() {
        const cordinator = 4;
        const getData = await this.prisma.user.findMany({
           where:{
            roleId : cordinator
           }
        });
        return{
            status : 200,
            data : getData
        }
    }

    async getClinicList() {
        const getData = await this.prisma.clinic.findMany({
            where: {
                cordinatorid: {
                in: null
                }
            }
        });

        return{
            status : 200,
            data : getData
        }
    }


    async getSelectedClinc(id:number) {
    
        const getData = await this.prisma.clinic.findMany({
            where:{
                cordinatorid : Number(id)
            }
        });
        return{
            status : 200,
            data : getData
        }
    }


    async  assignClinctoCordinator(clinciid: string, id: number) {
        const updateData = await this.prisma.clinic.update({
            where :{
                uuid : clinciid
            },
            data:{
                cordinatorid : Number(id)
            }
        });
        return{
            status : 200,
            data : updateData
        }
    }



    async removeClinic(id: string) {
        const remove = await this.prisma.clinic.update({
            where :{
                uuid : id
            },
            data :{
                cordinatorid : null
            }
        });

        return{
            status : 200,
            data : remove
        }
    }






}