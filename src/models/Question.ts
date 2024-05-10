import { Examen } from "./Examen";
import { SelectedResponse } from "./SelectedResponse";

export interface Question {
  id: number;
  label: string;
  examen: Examen;
  selectedResponses: SelectedResponse[];
}
