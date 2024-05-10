import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Examen } from 'src/models/Examen';
import { SelectedResponseRequest } from 'src/models/SelectedResponseRequest';
import { TypeExamen } from 'src/models/TypeExamen';
import { QuestionRequest } from 'src/models/question-request';
import { ExamenService } from 'src/services/examen.service';
import { QuestionService } from 'src/services/question.service';
import { SelectedResponseService } from 'src/services/selected-response.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  typeExamenId!: number;
  examId!: number;
  questions: QuestionRequest[] = [];
  exams: Examen[] = [];
  activeTab: string | null = null;
  typeExamens: TypeExamen[] = [];
  idPatient!: number;
  selectedResponses: SelectedResponseRequest[] = [];
  selectedResponseIds: { [questionId: number]: number[] } = {};
  selectedResponsesByExam: { [examId: number]: SelectedResponseRequest[] } = {};
  currentExamIndex: number = 0;
  nextExamQuestions: QuestionRequest[] = [];
  private questionsByExam: { [examId: number]: QuestionRequest[] } = {};


  constructor(
    private QS: QuestionService,
    private route: ActivatedRoute,
    private router: Router,
    private ES:ExamenService,
    private selectedResponsesService: SelectedResponseService ) {}


    ngOnInit() {
      this.route.params.subscribe(params => {
        this.typeExamenId = +params['typeexamId'];
        // Call the method to fetch the appropriate data
        this.fetchExamsByType();
      });
      this.route.queryParams.subscribe((queryParams) => {
        const encodedTabName = queryParams['activeTab'];
        if (encodedTabName) {
          this.activeTab = decodeURIComponent(encodedTabName);
        } else {
          this.activeTab = null;
        }
        this.idPatient = queryParams['idPatient'];
      });

      const storedTypeExamenId = localStorage.getItem('selectedTypeExamenId');
      if (storedTypeExamenId) {
        this.typeExamenId = parseInt(storedTypeExamenId, 10);
        this.fetchExamsByType();
      }

      const storedExamId = localStorage.getItem('examId');
      const storedActiveTab = localStorage.getItem('activeTab');

      if (storedExamId && storedActiveTab) {
        this.examId = parseInt(storedExamId, 10);
        this.activeTab = storedActiveTab;
      }

      const selectedExam = this.exams.find((exam) => exam.idExamen === this.examId);
      if (selectedExam) {
        this.activeTab = selectedExam.libelle;
      }
      this.initializeOrRetrieveSelectedResponses();
    }



    // Store selected responses in local storage when they change
storeSelectedResponsesInLocalStorage(examId: number, selectedResponses: SelectedResponseRequest[]): void {
  localStorage.setItem(`selectedResponses_${examId}`, JSON.stringify(selectedResponses));
}

// Retrieve selected responses from local storage for a specific exam
getSelectedResponsesFromLocalStorage(examId: number): SelectedResponseRequest[] | null {
  const storedResponses = localStorage.getItem(`selectedResponses_${examId}`);
  return storedResponses ? JSON.parse(storedResponses) : null;
}



    fetchExamsByType() {
      if (this.typeExamenId !== undefined) {
        this.ES.getExamsByType(this.typeExamenId).subscribe((data: Examen[]) => {
          this.exams = data;
          if (this.exams.length > 0) {
            this.examId = this.exams[0].idExamen;
            this.activeTab = this.exams[0].libelle;
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { activeTab: this.activeTab },
              queryParamsHandling: 'merge',
            });
            this.fetchQuestions();
          }
        });
      }
    }


    fetchQuestions() {
      // Check if selectedResponsesByExam is already initialized for the current exam
      if (!this.selectedResponsesByExam[this.examId]) {
        // If it's not initialized, fetch the questions and initialize selected responses
        this.QS.getQuestionsByExamId(this.examId).subscribe((questions: QuestionRequest[]) => {
          this.questionsByExam[this.examId] = questions;
          this.questions = questions;

          // Initialize selected responses for the current exam
          this.selectedResponsesByExam[this.examId] = this.initializeSelectedResponses();

          // Fetch questions only if responses are empty
          if (!this.selectedResponsesByExam[this.examId].length) {
            this.fetchQuestionsForExam();
          }
        });
      } else {
        // If selectedResponsesByExam is already initialized, retrieve selected responses
        this.questions = this.questionsByExam[this.examId];
        this.selectedResponses = this.selectedResponsesByExam[this.examId];
      }
    }


    initializeOrRetrieveSelectedResponses() {
      // Use the exam's unique identifier (examId) as part of the storage key
      const storageKey = `selectedResponses_${this.examId}`;

      // Retrieve selected responses using the examId from the current exam
      const storedResponses = localStorage.getItem(storageKey);
      if (storedResponses) {
        this.selectedResponses = JSON.parse(storedResponses);
      } else {
        // Initialize selectedResponses as empty if no stored responses are found
        this.selectedResponses = this.initializeSelectedResponses();
      }

      console.log('Selected Responses for Exam:', this.examId, this.selectedResponses);
    }



    initializeSelectedResponses(): SelectedResponseRequest[] {
      const selectedResponses: SelectedResponseRequest[] = [];

      for (const question of this.questions) {
        let selectedResponse: SelectedResponseRequest = {
          userId: this.idPatient,
          examenId: this.examId,
          questionId: question.id,
          responseIds: [],
          champResponseText: '',
        };

        if (question.responseType === 'RADIO' || question.responseType === 'CHECKBOX') {
          if (question.idReponses && question.responses) {
            for (let i = 0; i < question.responses.length; i++) {
              const response = question.responses[i];
              const idReponses = question.idReponses[i];

              const inputElement = document.querySelector(
                `input[name="${question.label}"][value="${response}"]`
              ) as HTMLInputElement;

              // Check if inputElement exists and is checked
              if (inputElement && inputElement.checked) {
                selectedResponse.responseIds.push(idReponses);
              }
            }
          }
        } else if (question.responseType === 'CHAMP') {
          const inputElement = document.querySelector(
            `input[name="${question.label}"]`
          ) as HTMLInputElement;

          const idReponseInputElement = document.querySelector(
            `input[name="${question.label}-idReponse"]`
          ) as HTMLInputElement;

          // Check if inputElement exists before accessing its value property
          if (inputElement && inputElement.value) {
            const champResponseText = inputElement.value.trim(); // Trim whitespace

            if (champResponseText !== '') {
              selectedResponse.champResponseText = champResponseText;
              if (idReponseInputElement) {
                selectedResponse.responseIds.push(Number(idReponseInputElement.value));
              }
            }
          }
        }

        // Only include the question and its responses if it has a non-empty response
        if (
          (selectedResponse.responseIds.length > 0 || selectedResponse.champResponseText !== '') &&
          selectedResponse.questionId === question.id
        ) {
          selectedResponses.push(selectedResponse);
        }
      }

      // Store the initialized selected responses for the current exam
      this.selectedResponsesByExam[this.examId] = selectedResponses;

      return selectedResponses;
    }


    setActiveTab(tabName: string) {
      const clickedTabIndex = this.exams.findIndex((exam) => exam.libelle === tabName);

      if (clickedTabIndex >= 0 && clickedTabIndex < this.exams.length) {
        const previousExamId = this.examId;
        this.examId = this.exams[clickedTabIndex].idExamen;
        this.activeTab = tabName;
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { activeTab: this.activeTab },
          queryParamsHandling: 'merge',
        });

        // Check if selected responses for the current exam are already initialized
        const selectedResponses = this.selectedResponsesService.getSelectedResponses(this.examId);
        if (!selectedResponses || !selectedResponses.length) {
          // If not initialized, fetch questions for the current exam
          this.fetchQuestionsForExam();
        } else {
          // If initialized, proceed to the selected tab
          this.currentExamIndex = clickedTabIndex;
          this.fetchQuestionsForNextExamAndRefreshUI();
        }
      }
    }


    fetchExams() {
      this.ES.getAllExamens().subscribe((data: Examen[]) => {
        this.exams = data;
        this.getAllTypeExamens();
      });
    }

    getAllTypeExamens(): void {
      this.ES.getAllTypeExamens().subscribe(data => {
        console.log('Fetched data:', data);
        this.typeExamens = data;
      });
    }


    submitSelectedResponses() {

      const selectedResponses: SelectedResponseRequest[] = this.selectedResponsesByExam[this.examId] || [];

      for (const question of this.questions) {
        let selectedResponse: SelectedResponseRequest = {
          userId: this.idPatient,
          examenId: this.examId,
          questionId: question.id,
          responseIds: [],
          champResponseText: '',
        };

        if (question.responseType === 'RADIO' || question.responseType === 'CHECKBOX') {
          if (question.idReponses && question.responses) {
            for (let i = 0; i < question.responses.length; i++) {
              const response = question.responses[i];
              const idReponses = question.idReponses[i];

              const inputElement = document.querySelector(
                `input[name="${question.label}"][value="${response}"]`
              ) as HTMLInputElement;

              // Check if inputElement exists and is checked
              if (inputElement && inputElement.checked) {
                selectedResponse.responseIds.push(idReponses);
              }
            }
          }
        } else if (question.responseType === 'CHAMP') {
          const inputElement = document.querySelector(
            `input[name="${question.label}"]`
          ) as HTMLInputElement;

          const idReponseInputElement = document.querySelector(
            `input[name="${question.label}-idReponse"]`
          ) as HTMLInputElement;

          // Check if inputElement exists before accessing its value property
          if (inputElement && inputElement.value) {
            const champResponseText = inputElement.value.trim(); // Trim whitespace

            if (champResponseText !== '') {
              selectedResponse.champResponseText = champResponseText;
              if (idReponseInputElement) {
                selectedResponse.responseIds.push(Number(idReponseInputElement.value));
              }
            }
          }
        }

        // Only include the question and its responses if it has a non-empty response
        if (
          (selectedResponse.responseIds.length > 0 || selectedResponse.champResponseText !== '') &&
          selectedResponse.questionId === question.id
        ) {
          // Check if the selected response already exists in selectedResponses and update it
          const existingResponseIndex = selectedResponses.findIndex(
            (resp) => resp.questionId === question.id
          );

          if (existingResponseIndex !== -1) {
            // Update the existing response
            selectedResponses[existingResponseIndex] = selectedResponse;
          } else {
            // Add the selected response to the array
            selectedResponses.push(selectedResponse);
          }
        }
      }

      // Update the selected responses for the current exam in the dictionary
      this.selectedResponsesByExam[this.examId] = selectedResponses;

      // Store the selected responses in local storage for the current exam
      this.storeSelectedResponsesInLocalStorage(this.examId, selectedResponses);

      // Pass to the next exam if available
      if (this.currentExamIndex < this.exams.length - 1) {
        this.examId = this.exams[this.currentExamIndex + 1].idExamen;
        this.activeTab = this.exams[this.currentExamIndex + 1].libelle;

        // Update the URL with the active tab's information
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { activeTab: this.activeTab },
          queryParamsHandling: 'merge',
        });

        // Fetch questions for the next exam and update the UI
        this.fetchQuestionsForNextExamAndRefreshUI();
      }

      console.log('Selected Responses for Exam:', this.examId, selectedResponses);
    }

  submitAllResponses() {
    const allSelectedResponses: SelectedResponseRequest[] = [];

    // Combine selected responses from all exams
    for (const examId in this.selectedResponsesByExam) {
      allSelectedResponses.push(...this.selectedResponsesByExam[examId]);
    }

    // Send all selected responses to the server
    this.QS.submitSelectedResponses(allSelectedResponses).subscribe((response: any) => {
      // Handle the response from the server if needed
      console.log('All selected responses submitted successfully.');

      const newConsultationId = response.consultationId; // Capture the new consultation ID

      // Navigate to the QuestionDetailComponent with the new consultation ID
      this.router.navigate(['/consultation-details', newConsultationId]);
    });
  }



  // Create a method to check if the current exam is the last one
  isLastExam(): boolean {
    return this.currentExamIndex === this.exams.length - 1;
  }

  fetchQuestionsForNextExam() {
    if (this.currentExamIndex < this.exams.length - 1) {
      this.examId = this.exams[this.currentExamIndex + 1].idExamen;
      this.QS.getQuestionsByExamId(this.examId).subscribe((questions: QuestionRequest[]) => {
        this.questions = questions;
        this.activeTab = this.exams[this.currentExamIndex + 1].libelle;
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { activeTab: this.activeTab },
          queryParamsHandling: 'merge',
        });
        this.currentExamIndex++;
      });
    }
  }

  fetchQuestionsForNextExamAndRefreshUI() {
    // Check if there is a next exam
    if (this.currentExamIndex < this.exams.length - 1) {
      // Update the examId and activeTab for the next exam
      this.examId = this.exams[this.currentExamIndex + 1].idExamen;
      this.activeTab = this.exams[this.currentExamIndex + 1].libelle;

      // Update the URL with the active tab's information
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { activeTab: this.activeTab },
        queryParamsHandling: 'merge',
      });

      // Fetch questions for the next exam
      this.QS.getQuestionsByExamId(this.examId).subscribe((questions: QuestionRequest[]) => {
        // Update the questions array
        this.questions = questions;
        // Increment the currentExamIndex to track the next exam
        this.currentExamIndex++;
      });
    }
  }

  fetchQuestionsForExam() {
    this.QS.getQuestionsByExamId(this.examId).subscribe((questions: QuestionRequest[]) => {
      this.questionsByExam[this.examId] = questions;
      this.questions = questions;

      // Initialize or retrieve selected responses
      this.initializeOrRetrieveSelectedResponses();
    });
  }



}
