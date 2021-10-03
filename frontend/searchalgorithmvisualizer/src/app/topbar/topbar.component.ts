import { Component, OnInit } from '@angular/core';
import {PathfinderService} from "../pathfinder.service";

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
    this.pathfinderService.solveDijkstra([]);
  }
}
