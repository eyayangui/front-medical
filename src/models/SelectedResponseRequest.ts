export interface SelectedResponseRequest {
  userId: number;
  examenId: number;
  questionId: number;
  responseIds: number[];
  champResponseText?: string;
}

