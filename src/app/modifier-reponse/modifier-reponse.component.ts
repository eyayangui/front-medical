import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Examen } from 'src/models/Examen';
import { SelectedResponse } from 'src/models/SelectedResponse';
import { SelectedResponseRequest } from 'src/models/SelectedResponseRequest';
import { TypeExamen } from 'src/models/TypeExamen';
import { QuestionRequest } from 'src/models/question-request';
import { ResponseConsultation } from 'src/models/responseConsultation';
import { ExamenService } from 'src/services/examen.service';
import { QuestionService } from 'src/services/question.service';
import { SelectedResponseService } from 'src/services/selected-response.service';

@Component({
  selector: 'app-modifier-reponse',
  templateUrl: './modifier-reponse.component.html',
  styleUrls: ['./modifier-reponse.component.css']
})
export class ModifierReponseComponent implements OnInit{

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
  consultationId!: number;
  selectedResponse: SelectedResponse[] = [];

  constructor(
    private QS: QuestionService,
    private route: ActivatedRoute,
    private router: Router,
    private ES:ExamenService,private http: HttpClient,
    private selectedResponsesService: SelectedResponseService ) {}


    ngOnInit() {
      this.route.params.subscribe(params => {
        this.typeExamenId = +params['typeexamId'];
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
        this.consultationId = queryParams['consultationId'];
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
          } else {
            // If responses are available, populate them in the UI
            this.populateResponsesInUI(this.selectedResponsesByExam[this.examId]);
          }
        });
      } else {
        // If selectedResponsesByExam is already initialized, retrieve selected responses
        this.questions = this.questionsByExam[this.examId];
        this.selectedResponses = this.selectedResponsesByExam[this.examId];

        // Populate the fetched responses in the UI
        this.populateResponsesInUI(this.selectedResponses);
      }
    }

    populateResponsesInUI(selectedResponses: SelectedResponseRequest[]) {
      for (const selectedResponse of selectedResponses) {
        const question = this.questions.find((q) => q.id === selectedResponse.questionId);
        if (question) {
          if (question.responseType === 'CHAMP') {
            const champInputElement = document.querySelector(`input[name="${question.label}"]`) as HTMLInputElement;
            if (champInputElement) {
              if (selectedResponse.champResponseText !== undefined) { // Add a null check here
                champInputElement.value = selectedResponse.champResponseText;
              }
            }
          } else if (question.responseType === 'RADIO' || question.responseType === 'CHECKBOX') {
            for (let i = 0; i < question.responses.length; i++) {
              const response = question.responses[i];
              const idReponses = question.idReponses[i];
              const inputElement = document.querySelector(
                `input[name="${question.label}"][value="${response}"]`
              ) as HTMLInputElement;
              if (inputElement && selectedResponse.responseIds.includes(idReponses)) {
                inputElement.checked = true;
              }
            }
          }
        }
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
      this.fetchSavedResponsesForConsultation();
      // Initialize or retrieve selected responses
      this.initializeOrRetrieveSelectedResponses();
    });
  }

  fetchSavedResponsesForConsultation() {
    this.selectedResponsesService.getSelectedResponsesForConsultation(this.consultationId).subscribe((responses: ResponseConsultation[]) => {
      this.processFetchedResponses(responses);
    });
  }

  processFetchedResponses(responses: ResponseConsultation[]) {
    console.log('Questions:', this.questions);
    console.log('Responses:', responses);
    for (const response of responses) {
      const question = this.questions.find((q) => q.id === response.idQuestion);
      if (question) {
        if (question.responseType === 'CHAMP') {
          const champInputElement = document.querySelector(`input[name="${question.label}"]`) as HTMLInputElement;
          if (champInputElement) {
            champInputElement.value = response.response;
          }
        } else if (question.responseType === 'RADIO' || question.responseType === 'CHECKBOX') {
          const inputElement = document.querySelector(`input[name="${question.label}"][value="${response.response}"]`) as HTMLInputElement;
          if (inputElement) {
            inputElement.checked = true;
          }
        }
      }
    }
  }


  submitSelectedResponse(question: QuestionRequest) {
    let selectedResponse: SelectedResponseRequest = {
      userId: this.idPatient,
      examenId: this.examId,
      questionId: question.id,
      responseIds: [],
      champResponseText: '',
    };

    if (question.responseType === 'RADIO' || question.responseType === 'CHECKBOX') {
      this.updateSelectedResponseForRadioOrCheckbox(question, selectedResponse);
    } else if (question.responseType === 'CHAMP') {
      this.updateSelectedResponseForChamp(question, selectedResponse);
    }

    this.selectedResponsesByExam[this.examId] = this.updateSelectedResponse(selectedResponse);
    this.storeSelectedResponsesInLocalStorage(this.examId, this.selectedResponsesByExam[this.examId]);

    this.selectedResponsesService.updateSelectedResponses(this.consultationId, question.id, selectedResponse).subscribe(
      (response: any) => {
        console.log('Selected response updated successfully.');
      },

    );
  }

  updateSelectedResponseForRadioOrCheckbox(
    question: QuestionRequest,
    selectedResponse: SelectedResponseRequest
  ) {
    if (question.idReponses && question.responses) {
      for (let i = 0; i < question.responses.length; i++) {
        const response = question.responses[i];
        const idReponses = question.idReponses[i];

        const inputElement = document.querySelector(
          `input[name="${question.label}"][value="${response}"]`
        ) as HTMLInputElement;

        if (inputElement && inputElement.checked) {
          selectedResponse.responseIds.push(idReponses);
        }
      }
    }
  }

  updateSelectedResponseForChamp(question: QuestionRequest, selectedResponse: SelectedResponseRequest) {
    const inputElement = document.querySelector(
      `input[name="${question.label}"]`
    ) as HTMLInputElement;

    const idReponseInputElement = document.querySelector(
      `input[name="${question.label}-idReponse"]`
    ) as HTMLInputElement;

    if (inputElement && inputElement.value) {
      const champResponseText = inputElement.value.trim();
      if (champResponseText !== '') {
        selectedResponse.champResponseText = champResponseText;
        if (idReponseInputElement) {
          selectedResponse.responseIds.push(Number(idReponseInputElement.value));
        }
      }
    }
  }

  updateSelectedResponse(selectedResponse: SelectedResponseRequest): SelectedResponseRequest[] {
    const existingResponseIndex = this.selectedResponses.findIndex(
      (resp) => resp.questionId === selectedResponse.questionId
    );

    if (existingResponseIndex !== -1) {
      this.selectedResponses[existingResponseIndex] = selectedResponse;
    } else {
      this.selectedResponses.push(selectedResponse);
    }

    return this.selectedResponses;
  }

  navigateToAnotherPage() {
    this.router.navigate(['/consultation-details', this.consultationId]);
  }

}
