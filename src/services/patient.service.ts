import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientListingComponent } from 'src/app/patient-listing/patient-listing.component';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private baseUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) { }
  GetAllPatient() {
    return this.http.get(`${this.baseUrl}/by-role?role=PATIENT`);
  }

  getPAtientByPatientId(patientId: number): Observable<any[]> {
    const url = `${this.baseUrl}/${patientId}`;
    return this.http.get<any[]>(url);
  }


}
