import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Examen } from 'src/models/Examen';
import { TypeExamen } from 'src/models/TypeExamen';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {

  private apiUrl = 'http://localhost:8080/api/v1/examens';

  private selectedTypeExamenId!: number;

  setSelectedTypeExamenId(typeExamenId: number) {
    this.selectedTypeExamenId = typeExamenId;
  }

  getSelectedTypeExamenId() {
    return this.selectedTypeExamenId;
  }
  constructor(private http: HttpClient) {}

  createExamen(examen: any): Observable<any> {
    return this.http.post(this.apiUrl + "/addexamen", examen);
  }

  getAllExamens(): Observable<any> {
    return this.http.get(this.apiUrl + "/allexamens");
  }

  deleteExamen(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addTypeExamen(typeExamen: TypeExamen): Observable<TypeExamen> {
    return this.http.post<TypeExamen>(`${this.apiUrl}/addTypeExamen`, typeExamen);
  }

  getAllTypeExamens(): Observable<any> {
    return this.http.get(this.apiUrl + "/alltypeexamens");
  }

  getExamsByType(typeExamenId: number): Observable<Examen[]> {
    return this.http.get<Examen[]>(`${this.apiUrl}/byType/${typeExamenId}`);
  }

  getExamIdByTypeExamen(typeExamenId: number): Observable<number> {
    const endpoint = `${this.apiUrl}/byTypeExamen/${typeExamenId}`;
    return this.http.get<number>(endpoint);
  }

  getExamsForConsultation(consultationId: number): Observable<Examen[]> {
    const url = `${this.apiUrl}/for-consultation/${consultationId}`;
    return this.http.get<Examen[]>(url);
  }
}
