



export class DoctorAddressCreateDto {
    
  clinicUuid!: string;   
  doctorUuid!: string;   
  zipcode?: string;
  street?: string;
  complement?: string;
  postalUnit?: string;
  neighborhood?: string;
  city?: string;
  
  stateCode?: string;
  stateName?: string;
  region?: string;
  ibgeCode?: string;
  giaCode?: string;
  areaCode?: string;
  siafiCode?: string;


}
