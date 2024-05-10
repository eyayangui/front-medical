import { Question } from "./Question";

export interface Examen {
  idExamen: number;
  libelle: string;
  typeExamen: string;
  typeExamenName: string;
  typeExamenId: number;
  questions: Question[];
}

