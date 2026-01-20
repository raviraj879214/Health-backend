




export interface Specialization {
  id: number;
  name: string;
}

export interface Specialty {
  id: number;
  name: string;
}

export interface Treatment {
  id: number;
  name: string;
}
export interface Places {
  id: string;
  name: string;
}




export  class BannerCreateClinicDto{

      specialization: Specialization[];
      specialty : Specialty[];
      treatment : Treatment[];
      places :  Places[];



        skip: number = 0;   
  limit: number = 0; 
  total?: number;   
}