import { Component, OnInit } from '@angular/core';
import {PathfinderService} from "../pathfinder.service";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent {

  constructor(public pathfinderService: PathfinderService) { }

  public generateMaze(){
    this.resetPath();
    return this.pathfinderService.generateMaze();
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

  resetPath() {
    this.pathfinderService.resetPath();
  }

  resetWalls() {
    this.pathfinderService.clearWalls();
  }

  onDiagonalToggle(checked: boolean) {
    this.pathfinderService.diagonalMovement = checked;
  }
}
