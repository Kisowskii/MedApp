import { Component } from '@angular/core';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],

})
export class AdminComponent {
  constructor() {}

  tiles: Tile[] = [
    { text: 'Lista Pacjentów', cols: 2, rows: 1, color: 'grey' },
    { text: 'Lista Lekarzy', cols: 2, rows: 1, color: 'grey' },
    { text: 'Stwórz Pacjenta', cols: 2, rows: 1, color: 'grey' },
    { text: 'Stwórz Lekarza', cols: 2, rows: 1, color: '#grey' },
  ];
}

