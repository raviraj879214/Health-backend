import { CreateOtherInformationDto } from "./create-other-information.dto";
import { UpdateOtherInformationDto } from "./update-other-information.dto";


export interface IOtherInformationService {

  create(
    patientQueryId: string,
    dto: CreateOtherInformationDto[]
  );

  findByPatientQueryId(
    patientQueryId: string
  );

  update(
    id: string,
    dto: UpdateOtherInformationDto
  );

  delete(
    id: string
  );
}
