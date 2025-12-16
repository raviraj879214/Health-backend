




export class DoctorUpdateDto {
  
  firstname?: string;
  lastname?: string;
  email?: string;
  dob?: string;
  crm?: string;
  languages?: string[];   // because Prisma model uses Json (array)
  videourl?: string;
  clinicuuid?: string;
  doctoruuid?:string;
  image_url?:string;
  cpf?:string;
  degree:string;


}
