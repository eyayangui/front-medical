import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/services/question.service';

@Component({
  selector: 'app-ajouter-question',
  templateUrl: './ajouter-question.component.html',
  styleUrls: ['./ajouter-question.component.css']
})
export class AjouterQuestionComponent implements OnInit  {
  examId!: number;
  questionForm!: FormGroup;
  questions!: MatTableDataSource<any>; // Array to hold questions for the exam
  responsesArray: string[] = ['']; // Array to store responses
  responseControls: FormGroup[] = [this.createResponseFormGroup()];

  displayedColumns: string[] = ['label', 'type', 'responses'];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private snackBar: MatSnackBar, private fb: FormBuilder
  ) {
    this.route.params.subscribe(params => {
      this.examId = +params['examId']; // Convert string to number
    });
    // Initialize the questionForm FormGroup
    this.questionForm = new FormGroup({
      label: new FormControl('', Validators.required),
      responseType: new FormControl('', Validators.required),
      responses: new FormControl([''], Validators.required) // Initialize with an empty string
    });

    this.questionForm = this.fb.group({
      label: ['', Validators.required],
      responseType: ['', Validators.required],
      responses: this.fb.array([]), // Initialize with an empty array
    });

  }

  submitForm() {
    const examId = this.examId;

    // Filter out empty responses before constructing the questionRequest
    const nonEmptyResponses = this.responseControls
      .map((control) => control.get('response')?.value.trim())
      .filter((response) => response !== '');

    const questionRequest = {
      label: this.questionForm.value.label,
      responseType: this.questionForm.value.responseType,
      responses: nonEmptyResponses,
    };

    this.questionService.addQuestion(examId, questionRequest).subscribe(
      (response) => {
        console.log('Question added successfully', response.message);
        this.snackBar.open('Question added successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: 'custom-toast',
        });

        // Clear the form controls and response inputs
        this.questionForm.reset();
        this.responseControls = [this.createResponseFormGroup()]; // Reset response inputs
        this.fetchQuestions();
      },
      (error) => {
        console.error('Error adding question', error);
      }
    );
  }


  ngOnInit() {
    if (this.responsesArray.length === 0) {
      this.addResponse();
    }
    this.fetchQuestions();
  }

  addResponse() {
    this.responseControls.push(this.createResponseFormGroup());
  }

  removeResponse(index: number) {
    this.responseControls.splice(index, 1);
  }

  private createResponseFormGroup(): FormGroup {
    return this.fb.group({
      response: ['', Validators.required], // Use a separate FormControl for each response
    });
  }

  fetchQuestions() {
    this.questionService.getQuestionsByExamId(this.examId)
      .subscribe(questions => {
        this.questions = new MatTableDataSource(questions);
        this.questions.paginator = this.paginator;

      });
  }


}
