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

  solveDijkstra() {
    let solution: Cell[]  = this.pathfinderService.solveDijkstra([]);
    for(let cell of solution){
      let elem = document.getElementById(cell.column+"-"+cell.row);
      elem?.classList.add('visited');
    }
  }
}
