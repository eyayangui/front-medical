import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ExamenService } from 'src/services/examen.service';

@Component({
  selector: 'app-type-examen',
  templateUrl: './type-examen.component.html',
  styleUrls: ['./type-examen.component.css']
})
export class TypeExamenComponent implements OnInit {

  typeExamen: any = {};

  constructor(
    public dialogRef: MatDialogRef<TypeExamenComponent>,
    private typeExamenService: ExamenService
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {

    this.typeExamenService.addTypeExamen(this.typeExamen).subscribe(
      (addedTypeExamen) => {

        console.log('TypeExamen added:', addedTypeExamen);

        // Close the dialog
        this.dialogRef.close(addedTypeExamen);
      },
      (error) => {
        console.error('Error adding TypeExamen:', error);
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
