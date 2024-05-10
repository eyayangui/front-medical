import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Examen } from 'src/models/Examen';
import { Question } from 'src/models/Question';
import { SelectedResponse } from 'src/models/SelectedResponse';
import { TypeExamen } from 'src/models/TypeExamen';
import { ConsultationService } from 'src/services/consultation.service';
import { ExamenService } from 'src/services/examen.service';
import { QuestionService } from 'src/services/question.service';
import { SelectedResponseService } from 'src/services/selected-response.service';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css']
})
export class QuestionDetailComponent implements OnInit {

  consultationId!: number;
  exams: Examen[] = [];
  private printWindow: Window | null = null;

  consultationData: any;

  constructor(
    private route: ActivatedRoute,
    private examenService: ExamenService,
    private questionService: QuestionService,
    private selectedResponseService: SelectedResponseService,
    private consultation:ConsultationService,
    private router: Router
  ) {}



  ngOnInit() {
    this.route.params.subscribe(params => {
      this.consultationId = +params['consultationId'];


      // Step 1: Fetch exams associated with the current consultation
      this.examenService.getExamsForConsultation(this.consultationId).subscribe((exams: Examen[]) => {
        this.exams = exams;

        // Step 2: Load questions for each exam
        this.exams.forEach(exam => {
          this.questionService.getQuestionsForExam(exam.idExamen, this.consultationId).subscribe((questions: Question[]) => {
            exam.questions = questions;

            // Step 3: Load selected responses for each question
            questions.forEach(question => {
              this.selectedResponseService.getSelectedResponsesForQuestion(question.id, this.consultationId).subscribe((responses: SelectedResponse[]) => {
                question.selectedResponses = responses;
              });
            });
          });
        });
      });
    });
  }

  printExams() {
    const printWindow = window.open('', '', 'width=600,height=600');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write('<html><head><title>Print</title></head><body>');

      // Add the content to be printed
      printWindow.document.write('<h1>Consultation : ' + this.consultationId + '</h1>');
      this.exams.forEach(exam => {
        printWindow.document.write('<h2>' + exam.libelle + '</h2>');
        if (exam.questions) {
          exam.questions.forEach(question => {
            printWindow.document.write('<p><strong>' + question.label + '</strong>: ');


            if (question.selectedResponses) {
              question.selectedResponses.forEach(response => {
                printWindow.document.write(response.response + ', ');
              });
            }


            printWindow.document.write('</p>');
          });
        }
      });

      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    } else {
      alert('The print window could not be opened. Please check your browser settings.');
    }
  }

  fetchTypeExamenForConsultation(consultationId: number) {
    this.consultation.getTypeExamenForConsultation(consultationId).subscribe((typeExamen: TypeExamen) => {
      if (typeExamen && typeExamen.id) {
        this.navigateToQuestions(typeExamen.id);
      } else {
        console.error('TypeExamen ID is undefined. Unable to navigate.');
      }
    });
  }


  navigateToQuestions(typeExamenId: number | undefined) {
    if (typeExamenId) {
      this.router.navigate(['/questions-modifier', typeExamenId], {
        queryParams: { consultationId: this.consultationId },

      });
    } else {
      console.error('TypeExamen ID is undefined. Unable to navigate.');
    }
  }


  navigateToUpdate(consultationId: number) {
    this.fetchTypeExamenForConsultation(consultationId);
  }


}
