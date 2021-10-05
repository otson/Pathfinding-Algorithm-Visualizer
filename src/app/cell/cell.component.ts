import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../app.service";
import {PathfinderService} from "../pathfinder.service";

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
  @Input() public isWall: boolean = false;
  @Input() public row: number = 0;
  @Input() public column: number = 0;
  @Input() public isStart: boolean = false;
  @Input() public isEnd: boolean = false;

  constructor(private appService: AppService, private pathfinderService: PathfinderService) { }

  ngOnInit(): void {
  }

  mouseEnter() {
    if(this.appService.isPainting){
      this.flipWall();
    }
  }

  mouseDown() {
    this.flipWall();
  }

  flipWall(){
    if(this.isStart || this.isEnd) return;
    this.isWall = !this.isWall;
    this.pathfinderService.getMap()[this.row][this.column].isWall = this.isWall
  }

  getId() {
    return this.column + "-" +this.row;
  }


}
