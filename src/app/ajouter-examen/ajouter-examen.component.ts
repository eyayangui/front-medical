import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ExamenService } from 'src/services/examen.service';
import { TypeExamenComponent } from '../type-examen/type-examen.component';
import { TypeExamen } from 'src/models/TypeExamen';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ajouter-examen',
  templateUrl: './ajouter-examen.component.html',
  styleUrls: ['./ajouter-examen.component.css']
})
export class AjouterExamenComponent implements OnInit{

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['libelle', 'typeExamen', 'actions'];

  typeExamenList: TypeExamen[] = [];

  exams: any[] = [];

  examen = {
    libelle: '',
    typeExamen: '',
    typeExamenName: ''
  };

  dynamicRadioValues: { value: string; label: string }[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private snackBar: MatSnackBar,
    private examenService: ExamenService, private router: Router, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.exams);
  }
  ngOnInit(): void {
    this.getExamens();
    this.getAllTypeExamens();
  }

  navigateToAddQuestions(examId: number) {
    this.router.navigate(['/add-questions', examId]);
  }

  deleteExamen(id: number): void {
    this.examenService.deleteExamen(id).subscribe(
      () => {
        console.log('Examen deleted successfully');
        this.getExamens();
      },
      (error) => {
        console.error('Error deleting examen:', error);
      }
    );
  }


  createExamen() {
    if (!this.examen.typeExamen) {
      this.snackBar.open('Type Examen is required.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }

    this.examenService.createExamen(this.examen).subscribe(
      (createdExamen) => {
        console.log('Examen created:', createdExamen);
        this.examen.libelle = '';
        this.examen.typeExamen = '';
        this.examen.typeExamenName = createdExamen.typeExamenName;
        this.getExamens();
      },
      (error) => {
        console.error('Error creating examen:', error);
      }
    );
  }



  getExamens(): void {
    this.examenService.getAllExamens().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      // Extract unique typeExamen values from the fetched data and cast them to string
      const uniqueTypeExamenValues: string[] = [...new Set((data as any[]).map(item => (item.typeExamenName as string)))];

      // Create radio button options based on unique typeExamen values
      this.dynamicRadioValues = uniqueTypeExamenValues.map(value => ({
        value,
        label: value
      }));
    });
  }

  getAllTypeExamens(): void {
    this.examenService.getAllTypeExamens().subscribe(data => {
      this.typeExamenList = data;
    });
  }


  openAddTypeExamenModal(): void {
    const dialogRef = this.dialog.open(TypeExamenComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllTypeExamens();
        console.log('Dialog result:', result);
      }
    });
  }



}
