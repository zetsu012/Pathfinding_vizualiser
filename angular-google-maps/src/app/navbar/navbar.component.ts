import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output() pathfindingTriggered = new EventEmitter<string>();
  selectedAlgorithm: string = 'bfs';

  constructor() { }

  triggerPathfinding() {
    console.log(this.selectedAlgorithm);
    this.pathfindingTriggered.emit(this.selectedAlgorithm);
  }
}
