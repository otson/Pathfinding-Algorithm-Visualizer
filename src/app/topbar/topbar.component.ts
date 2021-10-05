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

  public generateMaze(){
    return this.pathfinderService.generateMaze();
  }

  solveBreadthFirst() {
    this.reset();
    this.animate(this.pathfinderService.solveBreadthFirst());
  }

  solveAStar() {
    this.reset();
    this.animate((this.pathfinderService.solveAStar()));
  }

  private animate(solution: Response){
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
            elem?.classList.add('path');
          }, 25 * i + 50 * j));
        }
      }
    }
  }

  reset() {
    this.pathfinderService.clear();
    let visited = document.getElementsByClassName('visited');
    while(visited.length > 0){
      visited[0].classList.remove('path');
      visited[0].classList.remove('visited');
    }
    while(this.timeouts.length > 0){
      clearTimeout(this.timeouts.pop());
    }
  }


}
