import { Component, OnInit } from '@angular/core';
import {AppService} from "../app.service";

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
  isWall: boolean = false;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
  }

  mouseEnter() {
    if(this.appService.isPainting){
      this.isWall = !this.isWall;
    }
  }
}
