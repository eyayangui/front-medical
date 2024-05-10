import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { WelcomeComponent } from './welcome/welcome.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatRadioModule} from "@angular/material/radio";
import {MatTableModule} from "@angular/material/table"
import {MatPaginatorModule} from "@angular/material/paginator"
import {MatSortModule} from "@angular/material/sort"
import {MatDialogModule} from "@angular/material/dialog"
import {MatSelectModule} from "@angular/material/select"
import {MatCheckboxModule} from "@angular/material/checkbox";
import { FlexLayoutModule } from '@angular/flex-layout';
import { PatientListingComponent } from './patient-listing/patient-listing.component';
import { ModifierPatientComponent } from './modifier-patient/modifier-patient.component';
import { AjouterPatientComponent } from './ajouter-patient/ajouter-patient.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AjouterExamenComponent } from './ajouter-examen/ajouter-examen.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AjouterQuestionComponent } from './ajouter-question/ajouter-question.component';
import { TypeExamenComponent } from './type-examen/type-examen.component';
import { QuestionsComponent } from './questions/questions.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ConsultationComponent } from './consultation/consultation.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { ModifierReponseComponent } from './modifier-reponse/modifier-reponse.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    PatientListingComponent,
    ModifierPatientComponent,
    AjouterPatientComponent,
    AjouterExamenComponent,
    AjouterQuestionComponent,
    TypeExamenComponent,
    QuestionsComponent,
    ConsultationComponent,
    QuestionDetailComponent,
    ModifierReponseComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatListModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
