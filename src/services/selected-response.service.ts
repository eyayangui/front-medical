import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { SelectedResponse } from 'src/models/SelectedResponse';
import { SelectedResponseRequest } from 'src/models/SelectedResponseRequest';
import { ResponseConsultation } from 'src/models/responseConsultation';

@Injectable({
  providedIn: 'root'
})
export class SelectedResponseService {

  private apiUrl = 'http://localhost:8080/api/v1/selected-responses' ;
  private selectedResponses: { [examId: number]: SelectedResponseRequest[] } = {};

  constructor(private http:HttpClient) {}

  getResponsesByExamQuestionAndUser(examId: number, questionId: number, userId: number): Observable<SelectedResponseRequest[]> {
    return this.http.get<SelectedResponseRequest[]>(`${this.apiUrl}/responses`, {
        params: {
            examId: examId.toString(),
            questionId: questionId.toString(),
            userId: userId.toString()
        }
    });
  }

  setSelectedResponses(examId: number, responses: SelectedResponseRequest[]) {
    this.selectedResponses[examId] = responses;
  }

  getSelectedResponses(examId: number): SelectedResponseRequest[] | undefined {
    return this.selectedResponses[examId];
  }

  getSelectedResponsesForQuestion(questionId: number, consultationId: number): Observable<SelectedResponse[]> {
    const url = `${this.apiUrl}/for-question/${questionId}/${consultationId}`;
    return this.http.get<SelectedResponse[]>(url);
  }

  getSelectedResponsesForConsultation(consultationId: number): Observable<ResponseConsultation[]> {
    const url = `${this.apiUrl}/${consultationId}/selected-responses`;
    return this.http.get<ResponseConsultation[]>(url);
  }

  

  updateSelectedResponses(consultationId: number, questionId: number, request: any): Observable<any> {
    const url = `${this.apiUrl}/${consultationId}/${questionId}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.put<any>(url, request, httpOptions).pipe(
      catchError(error => {
        return throwError('Something went wrong; please try again later.');
      })
    );
  }

}
