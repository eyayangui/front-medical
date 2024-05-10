import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeExamen } from 'src/models/TypeExamen';
import { Consultation } from 'src/models/consultation';
import { ConsultationService } from 'src/services/consultation.service';
import { ExamenService } from 'src/services/examen.service';
import { PatientService } from 'src/services/patient.service';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css']
})
export class ConsultationComponent implements OnInit {

  buttons: TypeExamen[] = [];
  patient: any;
  idPatient!: number;
  bilanInitialResponded: boolean = false;


  constructor(private examenService: ExamenService, private router: Router,
    private route: ActivatedRoute, private patientService: PatientService,
    private CS:ConsultationService) {}
    consultations: Consultation[] = [];

    ngOnInit() {
      // Retrieve the idPatient from the route parameter
      this.route.params.subscribe(params => {
        this.idPatient = +params['idPatient']; 
        this.patientService.getPAtientByPatientId(this.idPatient).subscribe((data: any) => {
          this.patient = data;
        });
      });

      // Fetch buttons with typeExamenName and typeExamenId from your service
      this.examenService.getAllTypeExamens().subscribe((data: TypeExamen[]) => {
        this.buttons = data;
      });
      this.CS.getConsultationsForUser(this.idPatient).subscribe((data: Consultation[]) => {
        this.consultations = data;
      });
    }

    navigateToQuestions(typeExamenId?: number) {
      if (typeExamenId !== undefined) {
        localStorage.setItem('selectedTypeExamenId', typeExamenId.toString());
        this.examenService.setSelectedTypeExamenId(typeExamenId);

        this.router.navigate(['/questions', typeExamenId], {
          queryParams: { idPatient: this.idPatient },

        });
      }
    }

    viewConsultationDetails(consultationId: number) {
      this.router.navigate(['/consultation-details', consultationId], {
        queryParams: { idPatient: this.idPatient },
      });
    }


}
