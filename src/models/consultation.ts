import { TypeExamen } from "./TypeExamen";

export interface Consultation {
  idConsultation: number;
  dateConsultation: Date;
  typeExamen: TypeExamen;
}
