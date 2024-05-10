import { Examen } from "./Examen";
import { Question } from "./Question";
import { Consultation } from "./consultation";

export interface SelectedResponse {
  idSelected: number;
  date: Date;
  response: string;
  question: Question;
  examen: Examen;
  consultation: Consultation;
}
