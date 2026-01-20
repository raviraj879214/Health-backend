




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


export class DoctorAddress {
  id?:string;
  
  doctoruuid:string;

  clinicuuid:string;

  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  estado?: string;
  regiao?: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;


}



