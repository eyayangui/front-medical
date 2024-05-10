import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-print-consultation',
  templateUrl: './print-consultation.component.html',
  styleUrls: ['./print-consultation.component.css']
})
export class PrintConsultationComponent {

  @Input() consultationData: any;
}
