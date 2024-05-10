export interface RegisterRequest {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  cin?: number;
  phoneNumber?: string;
  gender?: string;
  birthDate?: string;
  adress?: string;
  familySituation?: string;
  medicalBackgroung?: string;
  role: "PATIENT";
}
