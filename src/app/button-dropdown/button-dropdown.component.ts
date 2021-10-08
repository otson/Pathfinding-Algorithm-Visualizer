import { Component, OnInit } from '@angular/core';
import {PathfinderService} from "../pathfinder.service";

@Component({
  selector: 'app-button-dropdown',
  templateUrl: './button-dropdown.component.html',
  styleUrls: ['./button-dropdown.component.css']
})
export class ButtonDropdownComponent implements OnInit {

  constructor(public pathfinderService: PathfinderService) { }

  ngOnInit(): void {
  }

  solveBreadthFirst() {
    this.pathfinderService.solveBreadthFirst();
  }

  solveAStar() {
    this.pathfinderService.solveAStar();
  }

  solveBestFirst() {
    this.pathfinderService.solveBestFirst();
  }

  solveDepthFirst() {
    this.pathfinderService.solveDepthFirst();
  }

  selectBFS() {
    this.pathfinderService.algorithmDescription =
      "Breadth First Search (BFS) selected."
    this.pathfinderService.selectedAlgorithm ="bfs";
  }

  selectAStar() {
    this.pathfinderService.algorithmDescription =
      "A Star (A*) selected."
    this.pathfinderService.selectedAlgorithm ="a*";
  }

  selectBestFirst() {
    this.pathfinderService.algorithmDescription =
      "Best First Search selected."
    this.pathfinderService.selectedAlgorithm ="bestFirst";
  }

  selectDFS() {
    this.pathfinderService.algorithmDescription =
      "Depth First Search (DFS) selected."
    this.pathfinderService.selectedAlgorithm ="dfs";
  }
}
