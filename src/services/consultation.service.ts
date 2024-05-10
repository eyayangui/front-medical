import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TypeExamen } from 'src/models/TypeExamen';
import { Consultation } from 'src/models/consultation';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private baseUrl = 'http://localhost:8080/api/v1/consultations';

  constructor(private http: HttpClient) { }

  getConsultationsForUser(userId: number): Observable<Consultation[]> {
    const url = `${this.baseUrl}/patient/${userId}`;
    return this.http.get<Consultation[]>(url);
  }

  getTypeExamenForConsultation(consultationId: number): Observable<TypeExamen> {
    const url = `${this.baseUrl}/${consultationId}/typeExamen`;
    return this.http.get<TypeExamen>(url);
  }

  saveTypeExamenId(consultationId: number, typeExamenId: number): Observable<string> {
    const params = {
      consultationId: consultationId,
      typeExamenId: typeExamenId
    };
    return this.http.post<string>(`${this.baseUrl}/saveTypeExamenId`, params);
  }
 

}
