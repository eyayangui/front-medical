import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationResponse } from 'src/models/authentication-response';
import { RegisterRequest } from 'src/models/register-request';
import { AuthenticationService } from 'src/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientListingComponent } from '../patient-listing/patient-listing.component';
import { PatientService } from 'src/services/patient.service';


@Component({
  selector: 'app-ajouter-patient',
  templateUrl: './ajouter-patient.component.html',
  styleUrls: ['./ajouter-patient.component.css']
})
export class AjouterPatientComponent implements OnInit {
  patientForm!: FormGroup;
  hide = true;

  registerRequest: RegisterRequest = {
    role: 'PATIENT'
  };
  authResponse: AuthenticationResponse = {};
  message = '';

  constructor(
    private _fb: FormBuilder,
    private AS: AuthenticationService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<AjouterPatientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.patientForm = this._fb.group({
      firstName: '',
      lastName: '',
      cin: '',
      tel: '',
      email: '',
      dob: '',
      gender: '',
      adress: '',
      password: '',
      familySituation: '',
      medicalBackgroung: '',

    });
  }
  ngOnInit(): void {
    this.patientForm.patchValue(this.data);

  }

  registerUser() {
    this.message = '';
    this.AS.register(this.registerRequest).subscribe({
      next: (response) => {
        if (response) {
          this.message = 'Account created successfully';
          this._snackBar.open(this.message, 'Close', {
            duration: 3000,
          });

          this.onCloseDialog();
          // Close the modal
          this._dialogRef.close(true);

          // Reload the current page and refresh patient data
          //location.reload();


        }
      },
      error: (error) => {
        console.error(error);
        this._snackBar.open('An error occurred', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onCloseDialog() {
    this._dialogRef.close(true);
  }

  closeDialog() {
    this.onCloseDialog();
  }



}
