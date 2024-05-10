import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PatientService } from 'src/services/patient.service';
import { ModifierPatientComponent } from '../modifier-patient/modifier-patient.component';
import { AjouterPatientComponent } from '../ajouter-patient/ajouter-patient.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-listing',
  templateUrl: './patient-listing.component.html',
  styleUrls: ['./patient-listing.component.css']
})
export class PatientListingComponent {
  constructor(private builder: FormBuilder, private PS: PatientService,
    public dialog: MatDialog, private router: Router) {
    this.LoadPatient();
  }
  isLoggedIn: boolean = true;
  patientlist: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  LoadPatient() {
    this.PS.GetAllPatient().subscribe((data) => {
      this.patientlist = data;
      this.dataSource = new MatTableDataSource(this.patientlist);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  goToConsultation(idPatient: number) {
    // Navigate to the ConsultationComponent with the idRecord parameter
    this.router.navigate(['/consultation', idPatient]);
  }

  openAjouterPatient() {
    const dialogRef = this.dialog.open(AjouterPatientComponent);

    // Pass the callback function to AjouterPatientComponent
    dialogRef.componentInstance.onCloseDialog = () => {
      // Callback function to reload patient data
      this.LoadPatient();
    };

  }

  displayedColumns: string[] = ['NumeroDossier', 'prenom', 'nom','tel',  'action'];

}
