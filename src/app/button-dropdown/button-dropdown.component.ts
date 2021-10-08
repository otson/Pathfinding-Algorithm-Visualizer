import { Component, OnInit } from '@angular/core';
import {PathfinderService} from "../pathfinder.service";

@Component({
  selector: 'app-button-dropdown',
  templateUrl: './button-dropdown.component.html',
  styleUrls: ['./button-dropdown.component.css']
})
export class ButtonDropdownComponent implements OnInit {

  constructor(private pathfinderService: PathfinderService) { }

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

}
