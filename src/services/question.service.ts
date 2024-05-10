import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from 'src/models/Question';
import { SelectedResponseRequest } from 'src/models/SelectedResponseRequest';
import { QuestionRequest } from 'src/models/question-request';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private baseUrl = 'http://localhost:8080/api/v1/questions';

  constructor(private http: HttpClient) {}



  addQuestion(examId: number, questionRequest: any): Observable<any> {
    const url = `${this.baseUrl}/${examId}/add`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, questionRequest, httpOptions);
  }


  getQuestionsByExamId(examId: number): Observable<any[]> {
    const url = `${this.baseUrl}/exam/${examId}`;
    return this.http.get<any[]>(url);
  }

  saveSelectedResponses(selectedResponses: QuestionRequest[]): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/v1/selected-responses/add', selectedResponses);
  }



  submitSelectedResponses(selectedResponses: SelectedResponseRequest[]) {
    console.log('Selected Responses to Submit:', selectedResponses);
    const url = 'http://localhost:8080/api/v1/selected-responses/add';
    return this.http.post(url, selectedResponses);
  }

  getQuestionsForExam(examId: number, consultationId: number): Observable<Question[]> {
    const url = `${this.baseUrl}/for-exam/${examId}/${consultationId}`;
    return this.http.get<Question[]>(url);
}

}
