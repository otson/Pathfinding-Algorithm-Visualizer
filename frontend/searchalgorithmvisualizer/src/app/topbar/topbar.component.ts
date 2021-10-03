import { Component, OnInit } from '@angular/core';
import {PathfinderService} from "../pathfinder.service";
import {Cell} from "../shared/cell.model";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  constructor(private pathfinderService: PathfinderService) { }

  ngOnInit(): void {
  }

  solveBreadthFirst() {
    let solution: Cell[]  = this.pathfinderService.solveBreadthFirst();
    for(let i = 0; i < solution.length; i++){
      setTimeout(function () {
        let cell = solution[i];
        let elem = document.getElementById(cell.column+"-"+cell.row);
        elem?.classList.add('visited');
      }, 25 * i);
    }
  }
}
