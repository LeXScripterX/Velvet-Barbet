import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-select-slot2',
  templateUrl: './select-slot2.page.html',
  styleUrls: ['./select-slot2.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SelectSlot2Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
