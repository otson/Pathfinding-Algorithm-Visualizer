import { Component, OnInit } from '@angular/core';
import {PathfinderService} from "../pathfinder.service";
import {Response} from "../shared/response.model";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent implements OnInit {

  constructor(private pathfinderService: PathfinderService) { }

  private timeouts: number[] = [];

  ngOnInit(): void {
  }

  solveBreadthFirst() {
    let solution: Response = this.pathfinderService.solveBreadthFirst();
    for(let i = 0; i < solution.traversal.length; i++){
      this.timeouts.push(setTimeout(function () {
        let cell = solution.traversal[i];
        let elem = document.getElementById(cell.column+"-"+cell.row);
        elem?.classList.add('visited');
      }, 25 * i));
      if(i == solution.traversal.length -1){
        for(let j = 0; j < solution.path.length; j++){
          this.timeouts.push(setTimeout(function () {
            let cell = solution.path[j];
            let elem = document.getElementById(cell.column+"-"+cell.row);
            elem?.classList.add('visited','path');
          }, 25 * i + 50 * j));
        }
      }
    }
  }

  reset() {
    this.pathfinderService.setup();
    while(this.timeouts.length > 0){
      clearTimeout(this.timeouts.pop());
    }
  }
}
